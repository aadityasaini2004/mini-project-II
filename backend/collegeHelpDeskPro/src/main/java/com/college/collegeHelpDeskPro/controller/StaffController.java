package com.college.collegeHelpDeskPro.controller;

import com.college.collegeHelpDeskPro.model.Ticket;
import com.college.collegeHelpDeskPro.model.TicketStatus;
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
@RequestMapping("/api/staff")
@PreAuthorize("hasRole('STAFF')") // Pura controller sirf Staff ke liye lock kar diya
public class StaffController {

    @Autowired
    private TicketRepository ticketRepository;

    @Autowired
    private UserRepository userRepository;

    private User getLoggedInStaff() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("Staff not found"));
    }

    @GetMapping("/my-tickets")
    public List<Ticket> getMyAssignedTickets() {
        User staff = getLoggedInStaff();

        return ticketRepository.findByAssignedStaffId(staff.getId());
    }

    @PutMapping("/update-status/{ticketId}")
    public String updateTicketStatus(@PathVariable String ticketId, @RequestParam TicketStatus status) {
        User staff = getLoggedInStaff();

        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found!"));

        if (ticket.getAssignedStaffId() == null || !ticket.getAssignedStaffId().equals(staff.getId())) {
            return "Error: You are not authorized! This ticket is not assigned to you.";
        }

        ticket.setStatus(status);
        ticketRepository.save(ticket);

        return "Success! Ticket [" + ticket.getTitle() + "] status has been updated to: " + status;
    }
}