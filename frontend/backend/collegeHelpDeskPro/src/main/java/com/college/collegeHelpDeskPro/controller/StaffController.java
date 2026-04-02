package com.college.collegeHelpDeskPro.controller;

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
@RequestMapping("/api/staff")
@PreAuthorize("hasRole('STAFF')") // Pura controller sirf Staff ke liye lock kar diya
public class StaffController {

    @Autowired
    private TicketRepository ticketRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;

    // Helper Method: Jo Staff login hai, uski details nikalne ke liye
    private User getLoggedInStaff() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("Staff not found"));
    }

    // 1. APNI ASSIGNED TICKETS DEKHNA
    @GetMapping("/my-tickets")
    public List<Ticket> getMyAssignedTickets() {
        User staff = getLoggedInStaff();
        // Sirf wahi tickets aayengi jo is staff ki _id par assigned hain
        return ticketRepository.findByAssignedStaffId(staff.getId());
    }

    // 2. TICKET KA STATUS UPDATE KARNA (e.g., PENDING -> RESOLVED)
    @PutMapping("/update-status/{ticketId}")
    public String updateTicketStatus(@PathVariable String ticketId, @RequestParam String status) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found!"));

        ticket.setStatus(TicketStatus.valueOf(status));
        ticket.setUpdatedAt(LocalDateTime.now());
        ticketRepository.save(ticket);

        // 🔥 NOTIFICATION: Jab Staff 'RESOLVED' mark kare, toh CR ko mail jaye
        if ("RESOLVED".equalsIgnoreCase(status)) {
            try {
                User cr = userRepository.findById(ticket.getCrId())
                        .orElseThrow(() -> new RuntimeException("CR not found"));

                String subject = "✅ Problem Solved: " + ticket.getTitle();
                String body = "Hello " + cr.getName() + ",\n\n"
                        + "Good news! Aapki raise ki gayi ticket resolve ho chuki hai.\n\n"
                        + "📌 Details:\n"
                        + "- Ticket: " + ticket.getTitle() + "\n"
                        + "- Status: RESOLVED\n\n"
                        + "Agar aap satisfied hain toh dashboard check karein. Shukriya!\n\n"
                        + "Regards,\nCollege Help Desk Team";

                emailService.sendMail(cr.getEmail(), subject, body);
            } catch (Exception e) {
                System.err.println("CR ko Resolution mail bhejne me error: " + e.getMessage());
            }
        }
        return "Status updated to " + status;
    }
}