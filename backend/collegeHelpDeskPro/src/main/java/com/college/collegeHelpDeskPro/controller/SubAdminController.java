package com.college.collegeHelpDeskPro.controller;

import com.college.collegeHelpDeskPro.model.Department;
import com.college.collegeHelpDeskPro.model.Role;
import com.college.collegeHelpDeskPro.model.User;
import com.college.collegeHelpDeskPro.repository.DepartmentRepository;
import com.college.collegeHelpDeskPro.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/subadmin")
public class SubAdminController {

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/create-department")
    @PreAuthorize("hasRole('SUB_ADMIN')")
    public String createDepartment(@RequestBody Department department) {

        // Check karo ki department pehle se toh nahi hai
        if (departmentRepository.existsByName(department.getName())) {
            return "Error: Department [" + department.getName() + "] already exists!";
        }

        departmentRepository.save(department);
        return "Department [" + department.getName() + "] created successfully!";
    }

    @PostMapping("/create-dept-admin")
    @PreAuthorize("hasRole('SUB_ADMIN')")
    public String createDepartmentAdmin(@RequestBody User deptAdmin) {
        if(deptAdmin.getDepartmentId() == null || !departmentRepository.existsById(deptAdmin.getDepartmentId())) {
            return "Error: Invalid Department  Id! First Create Department!";
        }

        deptAdmin.setRole(Role.DEPARTMENT_ADMIN);
        deptAdmin.setPassword(passwordEncoder.encode(deptAdmin.getPassword()));
        deptAdmin.setAccountVerified(true);

        userRepository.save(deptAdmin);

        return "Department Admin [" + deptAdmin.getName() + "] created successfully and linked to Department!";
    }

}
