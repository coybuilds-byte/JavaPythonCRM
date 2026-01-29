package com.precisioncrm.crmcore.repository;

import com.precisioncrm.crmcore.model.JobOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface JobOrderRepository extends JpaRepository<JobOrder, Long> {
    List<JobOrder> findByClientId(Long clientId);
    long countByStatus(String status);
    List<JobOrder> findTop5ByOrderByCreatedDateDesc();
}
