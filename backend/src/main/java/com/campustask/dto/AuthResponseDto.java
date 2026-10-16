package com.campustask.dto;

import com.campustask.model.Student;

public class AuthResponseDto {

    private String token;
    private String type = "Bearer";
    private Long id;
    private String name;
    private String email;
    private String department;
    private String academicYear;
    private String rollNumber;
    private String role;
    private String message;

    public AuthResponseDto() {}

    public AuthResponseDto(String token, Student student, String message) {
        this.token = token;
        this.type = "Bearer";
        this.id = student.getId();
        this.name = student.getName();
        this.email = student.getEmail();
        this.department = student.getDepartment();
        this.academicYear = student.getAcademicYear();
        this.rollNumber = student.getRollNumber();
        this.role = student.getRole();
        this.message = message;
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public String getAcademicYear() { return academicYear; }
    public void setAcademicYear(String academicYear) { this.academicYear = academicYear; }

    public String getRollNumber() { return rollNumber; }
    public void setRollNumber(String rollNumber) { this.rollNumber = rollNumber; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}
