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
@PreAuthorize("hasRole('CR')")
public class CRController {

    @Autowired
    private TicketRepository ticketRepository;

    @Autowired
    private UserRepository userRepository;


    private User getLoggedInCR() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("CR not found"));
    }


    @PostMapping("/raise-ticket")
    public String raiseTicket(@RequestBody Ticket ticket) {
        User cr = getLoggedInCR();

        ticket.setCrId(cr.getUniversityId());

        if (ticket.getDepartmentId() == null) {
            return "Error: Please specify the Department ID for this query!";
        }

        ticketRepository.save(ticket);
        return "Ticket [" + ticket.getTitle() + "] raised successfully!";
    }


    @GetMapping("/my-tickets")
    public List<Ticket> getMyTickets() {
        User cr = getLoggedInCR();

        return ticketRepository.findByCrId(cr.getUniversityId());
    }
}