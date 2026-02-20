package com.college.collegeHelpDeskPro.controller;

import com.college.collegeHelpDeskPro.model.Ticket;
import com.college.collegeHelpDeskPro.model.User;
import com.college.collegeHelpDeskPro.repository.TicketRepository;
import com.college.collegeHelpDeskPro.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cr")
@PreAuthorize("hasRole('CR')") // Sirf CR isko access kar sakta hai
public class CRController {

    @Autowired
    private TicketRepository ticketRepository;

    @Autowired
    private UserRepository userRepository;

    // Helper Method: Logged-in CR ki details nikalne ke liye
    private User getLoggedInCR() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("CR not found"));
    }

    // 1. TICKET RAISE KARNA (Create)
    @PostMapping("/raise-ticket")
    public String raiseTicket(@RequestBody Ticket ticket) {
        User cr = getLoggedInCR();

        // Backend khud CR ki ID set karega
        ticket.setCrId(cr.getUniversityId());

        // CR ko batana padega ki query kis department ki hai
        if (ticket.getDepartmentId() == null) {
            return "Error: Please specify the Department ID for this query!";
        }

        ticketRepository.save(ticket);
        return "Ticket [" + ticket.getTitle() + "] raised successfully!";
    }

    // 2. APNI TICKETS DEKHNA (Read)
    @GetMapping("/my-tickets")
    public List<Ticket> getMyTickets() {
        User cr = getLoggedInCR();
        // Database se sirf is CR ki tickets utha ke laayega
        return ticketRepository.findByCrId(cr.getId());
    }
}