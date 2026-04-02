package com.college.collegeHelpDeskPro.controller;

import com.college.collegeHelpDeskPro.dto.AuthRequest;
import com.college.collegeHelpDeskPro.model.Role;
import com.college.collegeHelpDeskPro.model.User;
import com.college.collegeHelpDeskPro.repository.UserRepository;
import com.college.collegeHelpDeskPro.service.AuthService;
import com.college.collegeHelpDeskPro.utils.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity; // Naya import
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap; // Naya import
import java.util.Map; // Naya import

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private JwtUtils jwtService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/register-cr")
    public String registerCR(@RequestBody User crUser) {
        crUser.setRole(Role.CR);
        crUser.setAccountVerified(false);
        crUser.setPassword(passwordEncoder.encode(crUser.getPassword()));
        userRepository.save(crUser);

        return "CR Registration successful! Please wait for approval from College Administration.";
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateAndGetToken(@RequestBody AuthRequest authRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(authRequest.getEmail(), authRequest.getPassword())
        );

        if (authentication.isAuthenticated()) {
            String token = jwtService.generateToken(authRequest.getEmail());

            User user = userRepository.findByEmail(authRequest.getEmail())
                    .orElseThrow(() -> new RuntimeException("User not found in DB"));

            Map<String, Object> responseData = new HashMap<>();
            responseData.put("token", token);
            responseData.put("role", "ROLE_" + user.getRole().name());

            return ResponseEntity.ok(responseData);

        } else {
            throw new UsernameNotFoundException("Invalid user request!");
        }
    }
}