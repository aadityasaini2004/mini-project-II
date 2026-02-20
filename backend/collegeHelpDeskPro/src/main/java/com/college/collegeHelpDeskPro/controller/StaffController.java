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
    public String updateTicketStatus(@PathVariable String ticketId, @RequestParam TicketStatus status) {
        User staff = getLoggedInStaff();

        // Pehle Ticket dhundo
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found!"));

        // SECURITY CHECK: Kya yeh ticket sach mein is staff ko assign hui thi?
        // Agar nahi, toh error de do (taaki koi dusre ka ticket update na kar de)
        if (ticket.getAssignedStaffId() == null || !ticket.getAssignedStaffId().equals(staff.getId())) {
            return "Error: You are not authorized! This ticket is not assigned to you.";
        }

        // Status update karo
        ticket.setStatus(status);
        ticketRepository.save(ticket);

        return "Success! Ticket [" + ticket.getTitle() + "] status has been updated to: " + status;
    }
}