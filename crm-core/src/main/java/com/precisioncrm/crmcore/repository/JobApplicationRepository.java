package com.precisioncrm.crmcore.repository;

import com.precisioncrm.crmcore.model.JobApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface JobApplicationRepository extends JpaRepository<JobApplication, Long> {
    List<JobApplication> findByJobOrderId(Long jobOrderId);

    List<JobApplication> findByCandidateId(Long candidateId);
}
