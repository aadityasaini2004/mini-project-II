package com.college.collegeHelpDeskPro.controller;

import com.college.collegeHelpDeskPro.model.Role;
import com.college.collegeHelpDeskPro.model.User;
import com.college.collegeHelpDeskPro.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@RestController
@RequestMapping("/api/deptadmin")
public class DepartmentAdminController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/create-dept-head")
    @PreAuthorize("hasRole('DEPARTMENT_ADMIN')")
    public String createDepartmentAdmin(@RequestBody User deptHead) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String loggedInEmail  = authentication.getName();

        Optional<User> loggedInAdminOpt = userRepository.findByEmail(loggedInEmail);
        if(loggedInAdminOpt.isEmpty()) {
            return "Error: Unauthorized access!";
        }

        User loggedInAdmin = loggedInAdminOpt.get();

        deptHead.setDepartmentId(loggedInAdmin.getDepartmentId());
        deptHead.setRole(Role.DEPARTMENT_HEAD);
        deptHead.setPassword(passwordEncoder.encode(deptHead.getPassword()));
        deptHead.setAccountVerified(true);

        userRepository.save(deptHead);

        return "Department Head [" + deptHead.getName() + "] created successfully and strictly linked to your Department!";
    }
}
