package com.college.collegeHelpDeskPro.model;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.IndexOptions;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

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
    private boolean isVarified = false;

    private String departmentId;

    private String school;
    private String course;
    private String section;
    private String year;
}
