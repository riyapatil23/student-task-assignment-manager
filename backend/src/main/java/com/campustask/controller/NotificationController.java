package com.campustask.controller;

import com.campustask.dto.NotificationResponseDto;
import com.campustask.service.NotificationService;
import com.campustask.service.ReminderSchedulerService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "*")
public class NotificationController {

    private final NotificationService notificationService;
    private final ReminderSchedulerService reminderSchedulerService;

    public NotificationController(NotificationService notificationService,
                                  ReminderSchedulerService reminderSchedulerService) {
        this.notificationService = notificationService;
        this.reminderSchedulerService = reminderSchedulerService;
    }

    @GetMapping
    public ResponseEntity<List<NotificationResponseDto>> getNotifications(
            @RequestParam(required = false) Long studentId) {
        return ResponseEntity.ok(notificationService.getAllNotifications(studentId));
    }

    @GetMapping("/unread-count")
    public ResponseEntity<Map<String, Long>> getUnreadCount(
            @RequestParam(required = false) Long studentId) {
        long count = notificationService.getUnreadCount(studentId);
        Map<String, Long> res = new HashMap<>();
        res.put("unreadCount", count);
        return ResponseEntity.ok(res);
    }

    @PatchMapping("/{id}/read")
    public ResponseEntity<NotificationResponseDto> markAsRead(@PathVariable Long id) {
        return ResponseEntity.ok(notificationService.markAsRead(id));
    }

    @PatchMapping("/mark-all-read")
    public ResponseEntity<Map<String, String>> markAllAsRead(
            @RequestParam(required = false) Long studentId) {
        notificationService.markAllAsRead(studentId);
        Map<String, String> res = new HashMap<>();
        res.put("message", "All notifications marked as read.");
        return ResponseEntity.ok(res);
    }

    /**
     * Manual endpoint to trigger reminder check on demand (useful for testing and instant verification).
     */
    @PostMapping("/trigger-reminders")
    public ResponseEntity<Map<String, Object>> triggerReminders() {
        int count = reminderSchedulerService.processUpcomingReminders();
        Map<String, Object> res = new HashMap<>();
        res.put("message", "Reminder check executed successfully.");
        res.put("remindersGenerated", count);
        return ResponseEntity.ok(res);
    }
}
