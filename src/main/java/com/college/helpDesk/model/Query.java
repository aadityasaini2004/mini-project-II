package com.college.helpDesk.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.annotation.Collation;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Document(collection = "queries")
public class Query {

    @Id
    private String queryId;

    private String studentName;
    private String question;
    private String category;
    private String school;
    private String answer;
    private String answeredBy;
    private boolean isResolved = false;

    private LocalDateTime createdAt = LocalDateTime.now();
}
