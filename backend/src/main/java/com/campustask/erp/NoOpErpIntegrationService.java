package com.campustask.erp;

import com.campustask.model.Student;
import org.springframework.stereotype.Service;

import java.util.Optional;

/**
 * Default inactive fallback implementation of ErpIntegrationService.
 * Ensures the application runs completely standalone with zero external ERP dependencies,
 * avoiding any invented providers, mock APIs, or fake credentials.
 */
@Service
public class NoOpErpIntegrationService implements ErpIntegrationService {

    @Override
    public boolean isConfigured() {
        return false;
    }

    @Override
    public Optional<String> resolveErpStudentId(Student student) {
        return Optional.ofNullable(student.getErpStudentId());
    }
}
