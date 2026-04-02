package com.college.collegeHelpDeskPro.repository;

import com.college.collegeHelpDeskPro.model.Ticket;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface TicketRepository extends MongoRepository<Ticket, String> {

    List<Ticket> findByCrId(String crId);

    List<Ticket> findByDepartmentId(String departmentId);

    List<Ticket> findByAssignedStaffId(String assignedStaffId);
}