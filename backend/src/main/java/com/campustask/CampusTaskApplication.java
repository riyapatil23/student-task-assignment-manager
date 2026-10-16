package com.campustask;

import com.campustask.model.Assignment;
import com.campustask.model.Student;
import com.campustask.repository.AssignmentRepository;
import com.campustask.repository.StudentRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.scheduling.annotation.EnableScheduling;

import java.time.LocalDate;
import java.time.LocalTime;

@SpringBootApplication
@EnableScheduling
public class CampusTaskApplication {

    public static void main(String[] args) {
        SpringApplication.run(CampusTaskApplication.class, args);
    }

    /**
     * Seeds initial student and academic assignment data into MySQL if empty.
     */
    @Bean
    public CommandLineRunner initData(StudentRepository studentRepository,
                                      AssignmentRepository assignmentRepository) {
        return args -> {
            if (studentRepository.count() == 0) {
                Student defaultStudent = new Student(
                        "Riya Patil",
                        "riya.patil@engineering.edu",
                        "Information Technology",
                        "3rd Year"
                );
                studentRepository.save(defaultStudent);

                if (assignmentRepository.count() == 0) {
                    LocalDate today = LocalDate.now();

                    // 1. Assignment due tomorrow at 10:00 AM (Within 24h window -> perfect for testing automatic reminders!)
                    assignmentRepository.save(new Assignment(
                            "SQL Normalization & Indexing Mini-Project",
                            "Database Management Systems",
                            "Design 3NF schema for university portal and analyze query execution plans with B+ tree indexes.",
                            today.plusDays(1),
                            LocalTime.of(10, 0),
                            "High",
                            "Pending",
                            defaultStudent
                    ));

                    // 2. Assignment due in 3 days
                    assignmentRepository.save(new Assignment(
                            "Binary Search Tree & Graph Traversal Implementation",
                            "Data Structures & Algorithms",
                            "Implement BFS and DFS graph traversals in Java with cycle detection test cases.",
                            today.plusDays(3),
                            LocalTime.of(17, 30),
                            "Medium",
                            "Pending",
                            defaultStudent
                    ));

                    // 3. Completed assignment (due tomorrow, but completed -> should NOT get reminder!)
                    assignmentRepository.save(new Assignment(
                            "TCP/IP Socket Programming Assignment",
                            "Computer Networks",
                            "Multi-threaded client-server echo application using Java ServerSocket.",
                            today.plusDays(1),
                            LocalTime.of(12, 0),
                            "Medium",
                            "Completed",
                            defaultStudent
                    ));

                    // 4. Overdue assignment
                    assignmentRepository.save(new Assignment(
                            "Process Synchronization Semaphore Lab Report",
                            "Operating Systems",
                            "Solve Producer-Consumer problem using counting semaphores in Java.",
                            today.minusDays(2),
                            LocalTime.of(23, 59),
                            "High",
                            "Pending",
                            defaultStudent
                    ));
                }
            }
        };
    }
}
