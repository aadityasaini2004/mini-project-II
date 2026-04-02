package com.college.collegeHelpDeskPro;

import com.college.collegeHelpDeskPro.model.Role;
import com.college.collegeHelpDeskPro.model.User;
import com.college.collegeHelpDeskPro.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
public class CollegeHelpDeskProApplication {

	public static void main(String[] args) {
		SpringApplication.run(CollegeHelpDeskProApplication.class, args);
	}


	@Bean
	public CommandLineRunner initData(UserRepository userRepository, PasswordEncoder passwordEncoder) {
		return args -> {

			if (userRepository.findByEmail("admin@krmu.edu.in").isEmpty()) {
				User admin = new User();
				admin.setUniversityId("ADMIN-MASTER");
				admin.setName("System Admin");
				admin.setEmail("admin@krmu.edu.in");
				admin.setPassword(passwordEncoder.encode("admin123"));
				admin.setRole(Role.ADMIN);
				admin.setAccountVerified(true);

				userRepository.save(admin);
				System.out.println("✅ Super Admin created automatically in MongoDB!");
			} else {
				System.out.println("⚡ Super Admin already exists in database.");
			}
		};
	}
}
