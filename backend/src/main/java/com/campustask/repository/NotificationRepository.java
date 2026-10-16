package com.campustask.repository;

import com.campustask.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

    List<Notification> findByStudentIdOrderByCreatedAtDesc(Long studentId);

    List<Notification> findAllByOrderByCreatedAtDesc();

    long countByStudentIdAndIsReadFalse(Long studentId);

    long countByIsReadFalse();

    /**
     * Prevents duplicate reminders if application restarts or scheduler runs repeatedly.
     */
    boolean existsByStudentIdAndAssignmentIdAndReminderTypeAndTargetDueDateTime(
            Long studentId, Long assignmentId, String reminderType, LocalDateTime targetDueDateTime);

    boolean existsByAssignmentIdAndReminderTypeAndTargetDueDateTime(
            Long assignmentId, String reminderType, LocalDateTime targetDueDateTime);

    @Modifying
    @Query("UPDATE Notification n SET n.isRead = true, n.readAt = CURRENT_TIMESTAMP WHERE n.student.id = :studentId AND n.isRead = false")
    int markAllAsReadForStudent(@Param("studentId") Long studentId);

    @Modifying
    @Query("UPDATE Notification n SET n.isRead = true, n.readAt = CURRENT_TIMESTAMP WHERE n.isRead = false")
    int markAllAsRead();
}
