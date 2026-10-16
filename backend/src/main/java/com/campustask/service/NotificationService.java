package com.campustask.service;

import com.campustask.dto.NotificationResponseDto;
import com.campustask.exception.ResourceNotFoundException;
import com.campustask.model.Assignment;
import com.campustask.model.Notification;
import com.campustask.model.Student;
import com.campustask.repository.NotificationRepository;
import com.campustask.repository.StudentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final StudentRepository studentRepository;

    public NotificationService(NotificationRepository notificationRepository,
                               StudentRepository studentRepository) {
        this.notificationRepository = notificationRepository;
        this.studentRepository = studentRepository;
    }

    @Transactional(readOnly = true)
    public List<NotificationResponseDto> getAllNotifications(Long studentId) {
        List<Notification> list;
        if (studentId != null) {
            list = notificationRepository.findByStudentIdOrderByCreatedAtDesc(studentId);
        } else {
            list = notificationRepository.findAllByOrderByCreatedAtDesc();
        }
        return list.stream()
                .map(NotificationResponseDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public long getUnreadCount(Long studentId) {
        if (studentId != null) {
            return notificationRepository.countByStudentIdAndIsReadFalse(studentId);
        }
        return notificationRepository.countByIsReadFalse();
    }

    public NotificationResponseDto markAsRead(Long id) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notification with id " + id + " not found."));
        notification.markAsRead();
        Notification saved = notificationRepository.save(notification);
        return NotificationResponseDto.fromEntity(saved);
    }

    public void markAllAsRead(Long studentId) {
        if (studentId != null) {
            notificationRepository.markAllAsReadForStudent(studentId);
        } else {
            notificationRepository.markAllAsRead();
        }
    }

    /**
     * Creates and persists a 24-hour deadline reminder notification.
     */
    public Notification createDeadlineReminder(Assignment assignment) {
        Student student = assignment.getStudent();
        if (student == null) {
            // Default student fallback if not specified
            student = studentRepository.findAll().stream().findFirst().orElse(null);
        }

        LocalDateTime dueDateTime = assignment.getDueDateTime();
        String timeStr = (assignment.getDueTime() != null)
                ? assignment.getDueTime().format(DateTimeFormatter.ofPattern("hh:mm a"))
                : "11:59 PM";

        String title = "Deadline Reminder: " + assignment.getSubject();
        String message = String.format("Reminder: Your %s is due tomorrow at %s.",
                assignment.getTitle(), timeStr);

        Notification notification = new Notification(
                student,
                assignment,
                title,
                message,
                "24_HOUR_DEADLINE",
                dueDateTime
        );

        return notificationRepository.save(notification);
    }
}
