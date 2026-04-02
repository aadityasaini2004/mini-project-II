package com.college.collegeHelpDeskPro.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Data
@Document(collection = "tickets")
public class Ticket {

    @Id
    private String id;

    private String title;
    private String description;

    private String crId;

    private String departmentId;

    private String assignedStaffId;

    private TicketStatus status = TicketStatus.PENDING;

    private Date createdAt = new Date();
}