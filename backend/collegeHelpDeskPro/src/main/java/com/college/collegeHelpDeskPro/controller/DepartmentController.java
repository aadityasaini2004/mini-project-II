package com.college.collegeHelpDeskPro.controller;


import com.college.collegeHelpDeskPro.model.Department;
import com.college.collegeHelpDeskPro.repository.DepartmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/department")
public class DepartmentController {

    @Autowired
    private DepartmentRepository departmentRepository;

    @GetMapping("/all")
    public List<Department> getAllDepartment() {
        return departmentRepository.findAll();
    }
}
