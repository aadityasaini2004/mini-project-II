package com.college.collegeHelpDeskPro.repository;

import com.college.collegeHelpDeskPro.model.Department;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface DepartmentRepository extends MongoRepository<Department, String> {
    boolean existsByName(String name);
}
