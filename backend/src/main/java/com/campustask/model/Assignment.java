package com.campustask.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

/**
 * Entity representing an academic assignment or homework coursework.
 */
@Entity
@Table(name = "assignments")
public class Assignment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String title;

    @Column(nullable = false, length = 100)
    private String subject;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "due_date", nullable = false)
    private LocalDate dueDate;

    @Column(name = "due_time")
    private LocalTime dueTime = LocalTime.of(23, 59);

    @Column(length = 20)
    private String priority = "Medium"; // "Low", "Medium", "High"

    @Column(nullable = false, length = 20)
    private String status = "Pending"; // "Pending", "Completed"

    @Column(nullable = false)
    private boolean deleted = false;

    /**
     * Flags whether the 24-hour deadline reminder has been generated and sent.
     * Prevents duplicate reminders even after application or scheduler restarts.
     */
    @Column(name = "reminder_sent", nullable = false)
    private boolean reminderSent = false;

    /**
     * The exact deadline timestamp for which the last reminder was sent.
     * If the student extends or modifies the deadline, reminderSent will reset.
     */
    @Column(name = "reminded_due_date_time")
    private LocalDateTime remindedDueDateTime;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "student_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Student student;

    public Assignment() {}

    public Assignment(String title, String subject, String description, LocalDate dueDate,
                      LocalTime dueTime, String priority, String status, Student student) {
        this.title = title;
        this.subject = subject;
        this.description = description;
        this.dueDate = dueDate;
        this.dueTime = (dueTime != null) ? dueTime : LocalTime.of(23, 59);
        this.priority = (priority != null) ? priority : "Medium";
        this.status = (status != null) ? status : "Pending";
        this.student = student;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    /**
     * Computes the combined LocalDateTime deadline.
     */
    public LocalDateTime getDueDateTime() {
        if (dueDate == null) return null;
        LocalTime time = (dueTime != null) ? dueTime : LocalTime.of(23, 59);
        return LocalDateTime.of(dueDate, time);
    }

    /**
     * Updates the deadline. If the deadline changed, resets reminder status
     * so that the student receives a fresh reminder for the updated due date/time.
     */
    public void updateDeadline(LocalDate newDate, LocalTime newTime) {
        LocalTime resolvedTime = (newTime != null) ? newTime : LocalTime.of(23, 59);
        LocalDateTime newDueDateTime = LocalDateTime.of(newDate, resolvedTime);
        LocalDateTime currentDueDateTime = getDueDateTime();

        if (currentDueDateTime == null || !currentDueDateTime.equals(newDueDateTime)) {
            this.dueDate = newDate;
            this.dueTime = resolvedTime;
            this.reminderSent = false;
            this.remindedDueDateTime = null;
        }
    }

    @PreUpdate
    public void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public LocalDate getDueDate() { return dueDate; }
    public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }

    public LocalTime getDueTime() { return dueTime; }
    public void setDueTime(LocalTime dueTime) { this.dueTime = dueTime; }

    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public boolean isDeleted() { return deleted; }
    public void setDeleted(boolean deleted) { this.deleted = deleted; }

    public boolean isReminderSent() { return reminderSent; }
    public void setReminderSent(boolean reminderSent) { this.reminderSent = reminderSent; }

    public LocalDateTime getRemindedDueDateTime() { return remindedDueDateTime; }
    public void setRemindedDueDateTime(LocalDateTime remindedDueDateTime) { this.remindedDueDateTime = remindedDueDateTime; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public Student getStudent() { return student; }
    public void setStudent(Student student) { this.student = student; }
}
