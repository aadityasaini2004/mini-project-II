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

    // Helper Method: Baar-baar logged-in Head ko nikalne se acha ek function bana liya
    private User getLoggedInHead() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return userRepository.findByEmail(auth.getName()).orElseThrow(() -> new RuntimeException("Head not found"));
    }

    // 1. ADD STAFF (Create)
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

    // 2. VIEW/SEARCH ALL STAFF (Read)
    @GetMapping("/my-staff")
    public List<User> getMyStaff() {
        User head = getLoggedInHead();
        // Sirf apne department ke STAFF members return karega
        return userRepository.findByDepartmentIdAndRole(head.getDepartmentId(), Role.STAFF);
    }

    // 3. UPDATE STAFF
    @PutMapping("/update-staff/{staffId}")
    public String updateStaff(@PathVariable String staffId, @RequestBody User updatedData) {
        User head = getLoggedInHead();
        Optional<User> staffOpt = userRepository.findById(staffId);

        if (staffOpt.isEmpty() || !staffOpt.get().getDepartmentId().equals(head.getDepartmentId())) {
            return "Error: Staff not found or does not belong to your department!";
        }

        User existingStaff = staffOpt.get();
        // Update details (Name, Email etc. jo frontend se aaye)
        if (updatedData.getName() != null) existingStaff.setName(updatedData.getName());
        if (updatedData.getEmail() != null) existingStaff.setEmail(updatedData.getEmail());

        userRepository.save(existingStaff);
        return "Staff details updated successfully!";
    }

    // 4. DELETE STAFF
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
        // Head ke department ID se saari tickets nikal lo
        return ticketRepository.findByDepartmentId(head.getDepartmentId());
    }

    // 2. ASSIGN TICKET TO STAFF (Head ticket staff ko dega)
    @PutMapping("/assign-ticket/{ticketId}/{staffId}")
    public String assignTicket(@PathVariable String ticketId, @PathVariable String staffId) {
        User head = getLoggedInHead();

        // 1. Pehle Ticket dhundo
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found!"));

        // Check: Kya yeh ticket mere hi department ki hai?
        if (!ticket.getDepartmentId().equals(head.getDepartmentId())) {
            return "Error: This ticket doesn't belong to your department!";
        }

        // 2. Phir Staff dhundo
        User staff = userRepository.findById(staffId)
                .orElseThrow(() -> new RuntimeException("Staff not found!"));

        // Check: Kya yeh staff mere hi department ka hai aur sach me STAFF hai?
        if (!staff.getDepartmentId().equals(head.getDepartmentId()) || staff.getRole() != Role.STAFF) {
            return "Error: Invalid Staff! You can only assign tickets to STAFF of your own department.";
        }

        // 3. Ticket assign karo aur Status update karo
        ticket.setAssignedStaffId(staff.getId());
        ticket.setStatus(TicketStatus.IN_PROGRESS); // Assign hote hi status IN_PROGRESS ho jayega

        ticketRepository.save(ticket);
        return "Ticket [" + ticket.getTitle() + "] assigned successfully to Staff: " + staff.getName();
    }
}