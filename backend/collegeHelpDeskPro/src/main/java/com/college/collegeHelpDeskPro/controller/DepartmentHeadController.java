package com.college.collegeHelpDeskPro.controller;

import com.college.collegeHelpDeskPro.model.Role;
import com.college.collegeHelpDeskPro.model.User;
import com.college.collegeHelpDeskPro.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
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
}