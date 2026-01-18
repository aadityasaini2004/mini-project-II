package com.college.helpDesk.config;

import com.college.helpDesk.security.JwtFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {
    @Autowired
    private JwtFilter jwtFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
                // ✅ CORS enabled
                .cors(cors -> {})

                // ❌ CSRF disabled (JWT)
                .csrf(csrf -> csrf.disable())

                // 🔐 JWT = STATELESS
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )

                // ✅ AUTH RULES
                .authorizeHttpRequests(auth -> auth

                        // Preflight
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        // Auth APIs
                        .requestMatchers("/api/auth/**").permitAll()

                        // STUDENT
                        .requestMatchers("/api/queries/ask").hasRole("STUDENT")
                        .requestMatchers("/api/queries/student/**").hasRole("STUDENT")

                        // FACULTY
                        .requestMatchers("/api/queries/answer/**").hasRole("FACULTY")
                        .requestMatchers("/api/queries/all").hasRole("FACULTY")

                        // HOD / DEAN
                        .requestMatchers("/api/queries/school/**")
                        .hasAnyRole("HOD", "DEAN")

                        .anyRequest().authenticated()
                )

                // 🔑 JWT FILTER
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
