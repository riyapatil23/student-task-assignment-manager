package com.campustask.service;

import com.campustask.dto.AssignmentRequestDto;
import com.campustask.exception.ResourceNotFoundException;
import com.campustask.model.Assignment;
import com.campustask.model.Student;
import com.campustask.repository.AssignmentRepository;
import com.campustask.repository.StudentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Service
@Transactional
public class AssignmentService {

    private final AssignmentRepository assignmentRepository;
    private final StudentRepository studentRepository;

    public AssignmentService(AssignmentRepository assignmentRepository,
                             StudentRepository studentRepository) {
        this.assignmentRepository = assignmentRepository;
        this.studentRepository = studentRepository;
    }

    @Transactional(readOnly = true)
    public List<Assignment> getAllAssignments() {
        return assignmentRepository.findByDeletedFalseOrderByDueDateAscDueTimeAsc();
    }

    @Transactional(readOnly = true)
    public Assignment getAssignmentById(Long id) {
        return assignmentRepository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new ResourceNotFoundException("Assignment with id " + id + " not found."));
    }

    public Assignment createAssignment(AssignmentRequestDto dto) {
        Student student = null;
        if (dto.getStudentId() != null) {
            student = studentRepository.findById(dto.getStudentId()).orElse(null);
        }
        if (student == null) {
            student = studentRepository.findAll().stream().findFirst().orElse(null);
        }

        LocalTime dueTime = (dto.getDueTime() != null) ? dto.getDueTime() : LocalTime.of(23, 59);

        Assignment assignment = new Assignment(
                dto.getTitle(),
                dto.getSubject(),
                dto.getDescription(),
                dto.getDueDate(),
                dueTime,
                dto.getPriority(),
                dto.getStatus(),
                student
        );

        return assignmentRepository.save(assignment);
    }

    public Assignment updateAssignment(Long id, AssignmentRequestDto dto) {
        Assignment assignment = getAssignmentById(id);

        assignment.setTitle(dto.getTitle());
        assignment.setSubject(dto.getSubject());
        assignment.setDescription(dto.getDescription());
        assignment.setPriority(dto.getPriority());
        assignment.setStatus(dto.getStatus());

        LocalTime dueTime = (dto.getDueTime() != null) ? dto.getDueTime() : LocalTime.of(23, 59);
        // Important: Handles updated deadline correctly and resets reminder state if changed
        assignment.updateDeadline(dto.getDueDate(), dueTime);

        return assignmentRepository.save(assignment);
    }

    public void deleteAssignment(Long id) {
        Assignment assignment = getAssignmentById(id);
        // Soft delete to ensure no further reminders fire
        assignment.setDeleted(true);
        assignmentRepository.save(assignment);
    }

    public Assignment toggleStatus(Long id) {
        Assignment assignment = getAssignmentById(id);
        String newStatus = "Completed".equalsIgnoreCase(assignment.getStatus()) ? "Pending" : "Completed";
        assignment.setStatus(newStatus);
        return assignmentRepository.save(assignment);
    }
}
