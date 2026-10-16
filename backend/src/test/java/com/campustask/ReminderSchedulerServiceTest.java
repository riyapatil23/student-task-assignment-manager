package com.campustask;

import com.campustask.dto.NotificationResponseDto;
import com.campustask.model.Assignment;
import com.campustask.model.Notification;
import com.campustask.model.Student;
import com.campustask.repository.AssignmentRepository;
import com.campustask.repository.NotificationRepository;
import com.campustask.repository.StudentRepository;
import com.campustask.service.NotificationService;
import com.campustask.service.ReminderSchedulerService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
class ReminderSchedulerServiceTest {

    @Autowired
    private ReminderSchedulerService reminderSchedulerService;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private AssignmentRepository assignmentRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private StudentRepository studentRepository;

    private Student testStudent;

    @BeforeEach
    void setUp() {
        notificationRepository.deleteAll();
        assignmentRepository.deleteAll();
        studentRepository.deleteAll();

        testStudent = new Student("Riya Patil", "riya.patil@test.edu", "IT", "3rd Year");
        studentRepository.save(testStudent);
    }

    @Test
    @DisplayName("1. Pending assignment due in 20 hours receives a 24-hour reminder")
    void testPendingAssignmentWithin24HoursReceivesReminder() {
        // Create an assignment due tomorrow at the same hour (20 hours ahead)
        LocalDateTime futureDue = LocalDateTime.now().plusHours(20);
        Assignment assignment = new Assignment(
                "DBMS Lab Report",
                "Database Management Systems",
                "Normalization exercises",
                futureDue.toLocalDate(),
                futureDue.toLocalTime(),
                "High",
                "Pending",
                testStudent
        );
        assignmentRepository.save(assignment);

        int generated = reminderSchedulerService.processUpcomingReminders();

        assertEquals(1, generated, "Expected exactly 1 reminder to be generated");
        List<Notification> notifications = notificationRepository.findAll();
        assertEquals(1, notifications.size(), "Notification table should contain 1 reminder");

        Notification notification = notifications.get(0);
        assertTrue(notification.getMessage().contains("DBMS Lab Report"));
        assertFalse(notification.isRead(), "New notification should be unread");

        // Verify assignment state is marked as reminded
        Assignment updatedAssignment = assignmentRepository.findById(assignment.getId()).orElseThrow();
        assertTrue(updatedAssignment.isReminderSent(), "Assignment should be marked as reminded");
    }

    @Test
    @DisplayName("2. Completed and deleted assignments do not receive reminders")
    void testCompletedAndDeletedAssignmentsDoNotReceiveReminders() {
        LocalDateTime futureDue = LocalDateTime.now().plusHours(12);

        // Completed assignment
        Assignment completedAssignment = new Assignment(
                "Completed Networks Lab",
                "Computer Networks",
                "Socket programming",
                futureDue.toLocalDate(),
                futureDue.toLocalTime(),
                "Medium",
                "Completed",
                testStudent
        );
        assignmentRepository.save(completedAssignment);

        // Deleted assignment
        Assignment deletedAssignment = new Assignment(
                "Old Assignment",
                "Operating Systems",
                "Discarded task",
                futureDue.toLocalDate(),
                futureDue.toLocalTime(),
                "Low",
                "Pending",
                testStudent
        );
        deletedAssignment.setDeleted(true);
        assignmentRepository.save(deletedAssignment);

        int generated = reminderSchedulerService.processUpcomingReminders();

        assertEquals(0, generated, "No reminders should be created for completed or deleted tasks");
        assertEquals(0, notificationRepository.count(), "Notifications table must remain empty");
    }

    @Test
    @DisplayName("3. Duplicate reminders are prevented when scheduler runs repeatedly")
    void testDuplicateRemindersArePrevented() {
        LocalDateTime futureDue = LocalDateTime.now().plusHours(15);
        Assignment assignment = new Assignment(
                "DSA Trees Assignment",
                "Data Structures",
                "AVL Tree rotations",
                futureDue.toLocalDate(),
                futureDue.toLocalTime(),
                "High",
                "Pending",
                testStudent
        );
        assignmentRepository.save(assignment);

        // First run
        int firstRun = reminderSchedulerService.processUpcomingReminders();
        assertEquals(1, firstRun, "First run should generate 1 reminder");

        // Second run immediately afterwards (simulates subsequent scheduled ticks or restart)
        int secondRun = reminderSchedulerService.processUpcomingReminders();
        assertEquals(0, secondRun, "Subsequent run must NOT generate duplicate reminder");

        assertEquals(1, notificationRepository.count(), "Total notifications should remain exactly 1");
    }

    @Test
    @DisplayName("4. Deadline change allows a new reminder for the updated due date")
    void testDeadlineChangeAllowsNewReminder() {
        // Initial deadline: 10 hours from now
        LocalDateTime initialDue = LocalDateTime.now().plusHours(10);
        Assignment assignment = new Assignment(
                "Software Architecture UML",
                "Software Engineering",
                "Use Case & Sequence Diagrams",
                initialDue.toLocalDate(),
                initialDue.toLocalTime(),
                "Medium",
                "Pending",
                testStudent
        );
        assignmentRepository.save(assignment);

        // First reminder processed
        reminderSchedulerService.processUpcomingReminders();
        assertEquals(1, notificationRepository.count(), "First reminder should be created");

        // Student or professor extends deadline to 22 hours from now
        LocalDateTime newDue = LocalDateTime.now().plusHours(22);
        assignment.updateDeadline(newDue.toLocalDate(), newDue.toLocalTime());
        assignmentRepository.save(assignment);

        // Verify reminderSent was reset because deadline changed
        assertFalse(assignment.isReminderSent(), "reminderSent flag should reset upon deadline change");

        // Scheduler runs again
        int secondRun = reminderSchedulerService.processUpcomingReminders();
        assertEquals(1, secondRun, "A new reminder should be generated for the updated deadline");
        assertEquals(2, notificationRepository.count(), "Should have 2 separate notifications for each distinct deadline");
    }

    @Test
    @DisplayName("5. Notifications mark as read and unread count functionality")
    void testReadUnreadStatus() {
        LocalDateTime futureDue = LocalDateTime.now().plusHours(8);
        Assignment assignment = new Assignment(
                "Java Multi-threading",
                "Java",
                "ExecutorService Lab",
                futureDue.toLocalDate(),
                futureDue.toLocalTime(),
                "High",
                "Pending",
                testStudent
        );
        assignmentRepository.save(assignment);

        reminderSchedulerService.processUpcomingReminders();

        List<NotificationResponseDto> list = notificationService.getAllNotifications(testStudent.getId());
        assertEquals(1, list.size());
        assertFalse(list.get(0).isRead(), "Initially should be unread");
        assertEquals(1, notificationService.getUnreadCount(testStudent.getId()));

        // Mark as read
        NotificationResponseDto updated = notificationService.markAsRead(list.get(0).getId());
        assertTrue(updated.isRead(), "Should now be marked as read");
        assertEquals(0, notificationService.getUnreadCount(testStudent.getId()), "Unread count should be 0");
    }
}
