package com.campustask.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * Entity representing an in-app notification sent to a student.
 */
@Entity
@Table(name = "notifications")
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "student_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Student student;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "assignment_id", nullable = false)
    @JsonIgnoreProperties({"student", "hibernateLazyInitializer", "handler"})
    private Assignment assignment;

    @Column(nullable = false, length = 150)
    private String title;

    @Column(nullable = false, length = 300)
    private String message;

    @Column(name = "reminder_type", length = 50)
    private String reminderType = "24_HOUR_DEADLINE";

    @Column(name = "target_due_date_time")
    private LocalDateTime targetDueDateTime;

    @Column(name = "is_read", nullable = false)
    private boolean isRead = false;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "read_at")
    private LocalDateTime readAt;

    public Notification() {}

    public Notification(Student student, Assignment assignment, String title, String message,
                        String reminderType, LocalDateTime targetDueDateTime) {
        this.student = student;
        this.assignment = assignment;
        this.title = title;
        this.message = message;
        this.reminderType = reminderType;
        this.targetDueDateTime = targetDueDateTime;
        this.isRead = false;
        this.createdAt = LocalDateTime.now();
    }

    public void markAsRead() {
        this.isRead = true;
        this.readAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Student getStudent() { return student; }
    public void setStudent(Student student) { this.student = student; }

    public Assignment getAssignment() { return assignment; }
    public void setAssignment(Assignment assignment) { this.assignment = assignment; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getReminderType() { return reminderType; }
    public void setReminderType(String reminderType) { this.reminderType = reminderType; }

    public LocalDateTime getTargetDueDateTime() { return targetDueDateTime; }
    public void setTargetDueDateTime(LocalDateTime targetDueDateTime) { this.targetDueDateTime = targetDueDateTime; }

    public boolean isRead() { return isRead; }
    public void setRead(boolean read) { isRead = read; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getReadAt() { return readAt; }
    public void setReadAt(LocalDateTime readAt) { this.readAt = readAt; }
}
