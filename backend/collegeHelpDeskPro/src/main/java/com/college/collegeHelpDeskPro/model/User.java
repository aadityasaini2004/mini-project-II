package com.college.collegeHelpDeskPro.model;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "users")
public class User {
    @Id
    private String id;

    @Indexed(unique = true)
    private String universityId;

    private String name;
    private String email;
    private String password;
    private Role role;

    private String departmentId;

    private String school;
    private String course;
    private String section;
    private String year;

   public boolean accountVerified = false;
}
