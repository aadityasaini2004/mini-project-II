package com.college.collegeHelpDeskPro.controller;

import com.college.collegeHelpDeskPro.model.Role;
import com.college.collegeHelpDeskPro.model.Ticket;
import com.college.collegeHelpDeskPro.model.TicketStatus;
import com.college.collegeHelpDeskPro.model.User;
import com.college.collegeHelpDeskPro.repository.TicketRepository;
import com.college.collegeHelpDeskPro.repository.UserRepository;
import com.college.collegeHelpDeskPro.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/cr")
@PreAuthorize("hasRole('CR')") // Sirf CR isko access kar sakta hai
public class CRController {

    @Autowired
    private TicketRepository ticketRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;

    // Helper Method: Logged-in CR ki details nikalne ke liye
    private User getLoggedInCR() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("CR not found"));
    }

    // 1. TICKET RAISE KARNA (Create)
    // 1. TICKET RAISE KARNA (Create)
    @PostMapping("/raise-ticket")
    public String raiseTicket(@RequestBody Ticket ticket) {
        User cr = getLoggedInCR();
        ticket.setCrId(cr.getId());
        ticket.setStatus(TicketStatus.PENDING);
        ticket.setCreatedAt(LocalDateTime.now());
        ticket.setUpdatedAt(LocalDateTime.now());

        ticketRepository.save(ticket);

        // 🔥 1. CR ko Confirmation Mail
        try {
            emailService.sendMail(cr.getEmail(),
                    "🎫 Ticket Raised Successfully",
                    "Aapki ticket '" + ticket.getTitle() + "' register ho gayi hai.");
        } catch (Exception e) { /* ignore */ }

        // 🔥 2. NAYA CODE: Department Head ko Alert Mail
        try {
            // Hum us department ke 'HEAD' ko dhoondh rahe hain
            List<User> heads = userRepository.findByDepartmentIdAndRole(ticket.getDepartmentId(), Role.DEPARTMENT_HEAD);

            for (User head : heads) {
                String subject = "🆕 New Ticket for your Department: " + ticket.getTitle();
                String body = "Hello " + head.getName() + ",\n\n"
                        + "Aapke department ke liye ek nayi ticket raise ki gayi hai.\n\n"
                        + "📌 Details:\n"
                        + "- Title: " + ticket.getTitle() + "\n"
                        + "- Raised By: " + cr.getName() + " (" + cr.getUniversityId() + ")\n\n"
                        + "Kripya dashboard login karein aur ise kisi Staff ko assign karein.\n\n"
                        + "Regards,\nCollege Help Desk System";

                emailService.sendMail(head.getEmail(), subject, body);
            }
        } catch (Exception e) {
            System.err.println("Head ko mail bhejne me error: " + e.getMessage());
        }

        return "Ticket raised successfully!";
    }
    // 2. APNI TICKETS DEKHNA (Read)
    @GetMapping("/my-tickets")
    public List<Ticket> getMyTickets() {
        User cr = getLoggedInCR();

        // 🔥 YAHAN BHI: University ID ke basis par hi search karna hai
        return ticketRepository.findByCrId(cr.getUniversityId());
    }
}