package com.college.collegeHelpDeskPro.controller;

import com.college.collegeHelpDeskPro.model.User;
import com.college.collegeHelpDeskPro.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthController {
    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public String addNewUser(@RequestBody User user) {
        return authService.saveUser(user);
    }

}
