package com.precisioncrm.crmcore.repository;

import com.precisioncrm.crmcore.model.Candidate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CandidateRepository extends JpaRepository<Candidate, Long> {
    @org.springframework.data.jpa.repository.Query("SELECT DISTINCT c FROM Candidate c LEFT JOIN c.skills s WHERE " +
            "LOWER(c.name) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(c.email) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(c.currentTitle) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(CAST(c.resumeText AS string)) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(s) LIKE LOWER(CONCAT('%', :query, '%'))")
    java.util.List<Candidate> searchCandidates(@org.springframework.data.repository.query.Param("query") String query);
    
    long countByStatus(String status);
    java.util.List<Candidate> findTop5ByOrderByIdDesc();
}
