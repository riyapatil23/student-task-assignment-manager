package com.campustask.erp;

import com.campustask.model.Student;
import java.util.Optional;

/**
 * Architectural boundary interface reserved for future College ERP integration.
 * <p>
 * This interface isolates all future ERP communication (such as course schedule sync
 * or institutional enrollment lookup) inside this dedicated module without coupling
 * the core Student Task & Assignment Manager authentication domain.
 * </p>
 * <b>Important Security & Design Guarantees:</b>
 * <ul>
 *   <li>No third-party ERP provider, endpoints, or credentials are invented or hardcoded.</li>
 *   <li>The student's external college ERP password is NEVER requested, stored, or processed.</li>
 *   <li>Provides clean extension points for when institutional APIs or OAuth bridges are officially introduced.</li>
 * </ul>
 */
public interface ErpIntegrationService {

    /**
     * Checks whether an institutional ERP connector is configured and active.
     *
     * @return true if an ERP module is configured; false otherwise.
     */
    boolean isConfigured();

    /**
     * Future hook to verify or link a student with an institutional ERP system.
     *
     * @param student the student profile in this application
     * @return empty optional when unconfigured; or future ERP metadata reference
     */
    Optional<String> resolveErpStudentId(Student student);
}
