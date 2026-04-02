package com.college.collegeHelpDeskPro.controller;

import com.college.collegeHelpDeskPro.dto.AuthRequest;
import com.college.collegeHelpDeskPro.model.Role;
import com.college.collegeHelpDeskPro.model.User;
import com.college.collegeHelpDeskPro.repository.UserRepository;
import com.college.collegeHelpDeskPro.service.AuthService;
import com.college.collegeHelpDeskPro.service.EmailService;
import com.college.collegeHelpDeskPro.utils.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity; // Naya import
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap; // Naya import
import java.util.Map; // Naya import
import java.util.Optional;
import java.util.Random;

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

    @Autowired
    private EmailService emailService;

    @PostMapping("/register-cr")
    public String registerCR(@RequestBody User crUser) {
        crUser.setRole(Role.CR);
        crUser.setAccountVerified(false); // PENDING APPROVAL
        crUser.setPassword(passwordEncoder.encode(crUser.getPassword()));
        userRepository.save(crUser);

        return "CR Registration successful! Please wait for approval from College Administration.";
    }

    // 🔥 JADU YAHAN HAI: Ab yeh String nahi, proper JSON Response dega
    @PostMapping("/login")
    public ResponseEntity<?> authenticateAndGetToken(@RequestBody AuthRequest authRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(authRequest.getEmail(), authRequest.getPassword())
        );

        if (authentication.isAuthenticated()) {
            // 1. Token banaya
            String token = jwtService.generateToken(authRequest.getEmail());

            // 2. Database se User nikala taaki Role pata chal sake
            User user = userRepository.findByEmail(authRequest.getEmail())
                    .orElseThrow(() -> new RuntimeException("User not found in DB"));

            // 3. Token aur Role dono ko ek Map me daala
            Map<String, Object> responseData = new HashMap<>();
            responseData.put("token", token);
            responseData.put("role", "ROLE_" + user.getRole().name());

            // 4. JSON format me frontend ko bhej diya
            return ResponseEntity.ok(responseData);

        } else {
            throw new UsernameNotFoundException("Invalid user request!");
        }
    }

    @PostMapping("/forgot-password")
    public String forgetPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");

        Optional<User> userOpt = userRepository.findByEmail(email);
        if(userOpt.isEmpty()) {
            return "Error: No Account with this email try with different email!";
        }

        User user = userOpt.get();

        String otp = String.valueOf(new Random().nextInt(9000) + 1000);

        user.setOtp(otp);
        user.setOtpExpiry(LocalDateTime.now().plusMinutes(5));

        String subject = "Password Reset OTP - College Help Desk Pro";
        String body = "Hello " + user.getName() + "\n\n" +
                "Your OTP for password reset is: " + otp + "\n\n" +
                "This OTP is valid for only 5 minutes. " +
                "Please don't share this OTP to anyone.";
        emailService.sendMail(email, subject, body);

        return "Success: OTP Sent to your mail!";
    }

    @PostMapping("/reset-password")
    public String resetPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String otp = request.get("otp");
        String newPassword = request.get("newPassword");

        Optional<User> userOpt = userRepository.findByEmail(email);
        if(userOpt.isEmpty()) {
            return "Error: User not found!";
        }

        User user = userOpt.get();

        if(user.getOtp() == null || !user.getOtp().equals(otp)) {
            return "Error: Invalid OTP!";
        }

        if(user.getOtpExpiry().isBefore(LocalDateTime.now())) {
            return "Error: OTP expired Please Try Again!";
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));

        user.setOtp(null);
        user.setOtpExpiry(null);
        userRepository.save(user);
        return "Success: Your Password is successfully changed!";
    }


}