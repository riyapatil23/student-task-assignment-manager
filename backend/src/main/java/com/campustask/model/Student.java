package com.campustask.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * Entity representing an authenticated Student enrolled in courses.
 * Stores account credentials (BCrypt hashed password) and academic metadata.
 */
@Entity
@Table(name = "students")
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, unique = true, length = 100)
    private String email;

    /**
     * BCrypt hashed password.
     * WRITE_ONLY prevents password hash from ever leaking in REST JSON responses.
     */
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @Column(nullable = false, length = 255)
    private String password;

    @Column(length = 50)
    private String role = "ROLE_STUDENT";

    @Column(length = 50)
    private String department;

    @Column(length = 20)
    private String academicYear;

    /**
     * College Roll Number (e.g. "IT-2024-042").
     */
    @Column(name = "roll_number", length = 50)
    private String rollNumber;

    /**
     * Architectural bridge identifier for future College ERP integration.
     * Prepared in a separate field without storing any ERP password or credentials.
     */
    @Column(name = "erp_student_id", length = 50)
    private String erpStudentId;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    public Student() {}

    public Student(String name, String email, String password, String department, String academicYear) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.department = department;
        this.academicYear = academicYear;
        this.role = "ROLE_STUDENT";
        this.createdAt = LocalDateTime.now();
    }

    public Student(String name, String email, String password, String department, String academicYear, String rollNumber) {
        this(name, email, password, department, academicYear);
        this.rollNumber = rollNumber;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public String getAcademicYear() { return academicYear; }
    public void setAcademicYear(String academicYear) { this.academicYear = academicYear; }

    public String getRollNumber() { return rollNumber; }
    public void setRollNumber(String rollNumber) { this.rollNumber = rollNumber; }

    public String getErpStudentId() { return erpStudentId; }
    public void setErpStudentId(String erpStudentId) { this.erpStudentId = erpStudentId; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
