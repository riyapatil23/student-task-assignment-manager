package com.campustask.service;

import com.campustask.model.Assignment;
import com.campustask.repository.AssignmentRepository;
import com.campustask.repository.NotificationRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Scheduled service that runs automatically to evaluate upcoming assignment
 * deadlines and trigger 24-hour advance reminders.
 */
@Service
public class ReminderSchedulerService {

    private static final Logger log = LoggerFactory.getLogger(ReminderSchedulerService.class);

    private final AssignmentRepository assignmentRepository;
    private final NotificationRepository notificationRepository;
    private final NotificationService notificationService;

    public ReminderSchedulerService(AssignmentRepository assignmentRepository,
                                    NotificationRepository notificationRepository,
                                    NotificationService notificationService) {
        this.assignmentRepository = assignmentRepository;
        this.notificationRepository = notificationRepository;
        this.notificationService = notificationService;
    }

    /**
     * Runs automatically every minute to evaluate upcoming deadlines.
     */
    @Scheduled(cron = "${app.reminder.cron:0 * * * * *}")
    @Transactional
    public void runScheduledReminderCheck() {
        processUpcomingReminders();
    }

    /**
     * Core reminder evaluation engine.
     * Can also be called directly for testing or on-demand triggers.
     *
     * @return Number of new reminders created.
     */
    @Transactional
    public int processUpcomingReminders() {
        LocalDateTime now = LocalDateTime.now();
        // 24 hours reminder window
        LocalDateTime windowEnd = now.plusHours(24);

        // Fetch candidate assignments: Pending, not deleted, and reminder not yet marked sent
        List<Assignment> candidates = assignmentRepository.findByStatusAndDeletedFalseAndReminderSentFalse("Pending");

        int remindersGenerated = 0;

        for (Assignment assignment : candidates) {
            // Guard clause: Ensure not completed and not deleted
            if (assignment.isDeleted() || "Completed".equalsIgnoreCase(assignment.getStatus())) {
                continue;
            }

            LocalDateTime dueDateTime = assignment.getDueDateTime();
            if (dueDateTime == null) {
                continue;
            }

            // Check if deadline is within the upcoming 24-hour window
            // (i.e. dueDateTime >= now AND dueDateTime <= now + 24 hours)
            boolean isWithin24Hours = !dueDateTime.isBefore(now) && !dueDateTime.isAfter(windowEnd);

            if (isWithin24Hours) {
                // Deduplication check: Ensure reminder hasn't already been created for this assignment deadline
                boolean alreadyNotified = notificationRepository
                        .existsByAssignmentIdAndReminderTypeAndTargetDueDateTime(
                                assignment.getId(), "24_HOUR_DEADLINE", dueDateTime
                        );

                if (!alreadyNotified) {
                    notificationService.createDeadlineReminder(assignment);
                    remindersGenerated++;
                    log.info("Generated 24-hour deadline reminder for assignment: '{}' (Due: {})",
                            assignment.getTitle(), dueDateTime);
                }

                // Mark assignment as reminded for this deadline to prevent duplicate scheduler runs
                assignment.setReminderSent(true);
                assignment.setRemindedDueDateTime(dueDateTime);
                assignmentRepository.save(assignment);
            }
        }

        return remindersGenerated;
    }
}
