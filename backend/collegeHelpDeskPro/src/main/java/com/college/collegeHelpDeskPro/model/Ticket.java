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

    private String title;       // Example: "Projector not working in Room 302"
    private String description; // Example: "Wire is broken..."

    private String crId;        // Jis CR ne ticket raise kiya uska ID

    private String departmentId; // Kis department ki query hai (IT Cell, Accounts etc.)

    private String assignedStaffId; // Kis staff ko assign hui (Shuru mein yeh null rahega)

    private TicketStatus status = TicketStatus.PENDING; // Default status Pending hoga

    private Date createdAt = new Date();
}