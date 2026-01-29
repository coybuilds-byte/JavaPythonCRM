package com.precisioncrm.crmcore.repository;

import com.precisioncrm.crmcore.model.Activity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ActivityRepository extends JpaRepository<Activity, Long> {
    List<Activity> findByCandidateId(Long candidateId);
    List<Activity> findByClientId(Long clientId);
}
