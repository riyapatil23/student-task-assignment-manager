package com.campustask.dto;

import com.campustask.model.Notification;

import java.time.LocalDateTime;

/**
 * Clean response DTO for in-app notification center.
 */
public class NotificationResponseDto {

    private Long id;
    private Long assignmentId;
    private String assignmentTitle;
    private String subject;
    private String title;
    private String message;
    private boolean isRead;
    private LocalDateTime createdAt;
    private LocalDateTime targetDueDateTime;

    public NotificationResponseDto() {}

    public static NotificationResponseDto fromEntity(Notification n) {
        NotificationResponseDto dto = new NotificationResponseDto();
        dto.setId(n.getId());
        if (n.getAssignment() != null) {
            dto.setAssignmentId(n.getAssignment().getId());
            dto.setAssignmentTitle(n.getAssignment().getTitle());
            dto.setSubject(n.getAssignment().getSubject());
        }
        dto.setTitle(n.getTitle());
        dto.setMessage(n.getMessage());
        dto.setRead(n.isRead());
        dto.setCreatedAt(n.getCreatedAt());
        dto.setTargetDueDateTime(n.getTargetDueDateTime());
        return dto;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getAssignmentId() { return assignmentId; }
    public void setAssignmentId(Long assignmentId) { this.assignmentId = assignmentId; }

    public String getAssignmentTitle() { return assignmentTitle; }
    public void setAssignmentTitle(String assignmentTitle) { this.assignmentTitle = assignmentTitle; }

    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public boolean isRead() { return isRead; }
    public void setRead(boolean read) { isRead = read; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getTargetDueDateTime() { return targetDueDateTime; }
    public void setTargetDueDateTime(LocalDateTime targetDueDateTime) { this.targetDueDateTime = targetDueDateTime; }
}
