package com.campustask.repository;

import com.campustask.model.Assignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface AssignmentRepository extends JpaRepository<Assignment, Long> {

    List<Assignment> findByDeletedFalseOrderByDueDateAscDueTimeAsc();

    List<Assignment> findByStudentIdAndDeletedFalseOrderByDueDateAscDueTimeAsc(Long studentId);

    Optional<Assignment> findByIdAndDeletedFalse(Long id);

    /**
     * Finds all active, non-deleted, pending assignments that have not yet had
     * their 24-hour reminder sent for their current deadline.
     */
    List<Assignment> findByStatusAndDeletedFalseAndReminderSentFalse(String status);

    /**
     * Query assignments pending and within an upcoming due date window.
     */
    @Query("SELECT a FROM Assignment a WHERE a.status = 'Pending' AND a.deleted = false " +
           "AND a.dueDate <= :targetDate AND a.reminderSent = false")
    List<Assignment> findPendingAssignmentsDueBefore(@Param("targetDate") LocalDate targetDate);
}
