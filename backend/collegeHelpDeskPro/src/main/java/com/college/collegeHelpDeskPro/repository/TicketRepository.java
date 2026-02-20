package com.college.collegeHelpDeskPro.repository;

import com.college.collegeHelpDeskPro.model.Ticket;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface TicketRepository extends MongoRepository<Ticket, String> {

    // CR ko uski khud ki raise ki hui tickets dikhane ke liye
    List<Ticket> findByCrId(String crId);

    // Department Head ko apne department ki saari tickets dikhane ke liye
    List<Ticket> findByDepartmentId(String departmentId);

    // Staff ko uski assigned tickets dikhane ke liye
    List<Ticket> findByAssignedStaffId(String assignedStaffId);
}