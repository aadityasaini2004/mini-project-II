package com.college.collegeHelpDeskPro.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Data
@Document(collection = "departments")
public class Department {

    @Id
    private String id;

    private String name;
    private String description;
    private String createdy;
    private Date createdAt = new Date();
}
