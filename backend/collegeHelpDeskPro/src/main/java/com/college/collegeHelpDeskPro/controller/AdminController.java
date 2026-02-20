package com.college.collegeHelpDeskPro.controller;


import com.college.collegeHelpDeskPro.model.Role;
import com.college.collegeHelpDeskPro.model.User;
import com.college.collegeHelpDeskPro.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
public class AdminController {


    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/create-sub-admin")
    @PreAuthorize("hasRole('ADMIN')")
    public String createSubAdmin(@RequestBody User subAdmin){
        subAdmin.setRole(Role.SUB_ADMIN);
        subAdmin.setPassword(passwordEncoder.encode(subAdmin.getPassword()));
        subAdmin.setAccountVerified(true);

        userRepository.save(subAdmin);

        return "Sub Admin [" + subAdmin.getName() + "] created successfully!";
    }

}
