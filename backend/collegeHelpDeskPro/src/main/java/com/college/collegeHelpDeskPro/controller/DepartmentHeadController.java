package com.college.collegeHelpDeskPro.controller;

import com.college.collegeHelpDeskPro.model.Role;
import com.college.collegeHelpDeskPro.model.Ticket;
import com.college.collegeHelpDeskPro.model.TicketStatus;
import com.college.collegeHelpDeskPro.model.User;
import com.college.collegeHelpDeskPro.repository.TicketRepository;
import com.college.collegeHelpDeskPro.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/head")
@PreAuthorize("hasRole('DEPARTMENT_HEAD')") // Pura controller sirf Head ke liye
public class DepartmentHeadController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private TicketRepository ticketRepository;

    private User getLoggedInHead() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return userRepository.findByEmail(auth.getName()).orElseThrow(() -> new RuntimeException("Head not found"));
    }

    @PostMapping("/add-staff")
    public String addStaff(@RequestBody User staff) {
        User head = getLoggedInHead();

        staff.setRole(Role.STAFF);
        staff.setDepartmentId(head.getDepartmentId()); // Head ka hi department assign hoga
        staff.setPassword(passwordEncoder.encode(staff.getPassword()));
        staff.setAccountVerified(true);

        userRepository.save(staff);
        return "Staff [" + staff.getName() + "] added successfully to your department!";
    }

    @GetMapping("/my-staff")
    public List<User> getMyStaff() {
        User head = getLoggedInHead();
        // Sirf apne department ke STAFF members return karega
        return userRepository.findByDepartmentIdAndRole(head.getDepartmentId(), Role.STAFF);
    }

    @PutMapping("/update-staff/{staffId}")
    public String updateStaff(@PathVariable String staffId, @RequestBody User updatedData) {
        User head = getLoggedInHead();
        Optional<User> staffOpt = userRepository.findById(staffId);

        if (staffOpt.isEmpty() || !staffOpt.get().getDepartmentId().equals(head.getDepartmentId())) {
            return "Error: Staff not found or does not belong to your department!";
        }

        User existingStaff = staffOpt.get();
        if (updatedData.getName() != null) existingStaff.setName(updatedData.getName());
        if (updatedData.getEmail() != null) existingStaff.setEmail(updatedData.getEmail());

        userRepository.save(existingStaff);
        return "Staff details updated successfully!";
    }


    @DeleteMapping("/delete-staff/{staffId}")
    public String deleteStaff(@PathVariable String staffId) {
        User head = getLoggedInHead();
        Optional<User> staffOpt = userRepository.findById(staffId);

        if (staffOpt.isEmpty() || !staffOpt.get().getDepartmentId().equals(head.getDepartmentId())) {
            return "Error: Staff not found or you don't have permission to delete them!";
        }

        userRepository.deleteById(staffId);
        return "Staff removed successfully!";
    }

    @GetMapping("/department-tickets")
    public List<Ticket> getDepartmentTickets() {
        User head = getLoggedInHead();

        return ticketRepository.findByDepartmentId(head.getDepartmentId());
    }


    @PutMapping("/assign-ticket/{ticketId}/{staffId}")
    public String assignTicket(@PathVariable String ticketId, @PathVariable String staffId) {
        User head = getLoggedInHead();

        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found!"));

        if (!ticket.getDepartmentId().equals(head.getDepartmentId())) {
            return "Error: This ticket doesn't belong to your department!";
        }

        User staff = userRepository.findById(staffId)
                .orElseThrow(() -> new RuntimeException("Staff not found!"));

        if (!staff.getDepartmentId().equals(head.getDepartmentId()) || staff.getRole() != Role.STAFF) {
            return "Error: Invalid Staff! You can only assign tickets to STAFF of your own department.";
        }

        ticket.setAssignedStaffId(staff.getId());
        ticket.setStatus(TicketStatus.IN_PROGRESS); // Assign hote hi status IN_PROGRESS ho jayega

        ticketRepository.save(ticket);
        return "Ticket [" + ticket.getTitle() + "] assigned successfully to Staff: " + staff.getName();
    }
}