package com.precisioncrm.crmcore.controller;

import com.precisioncrm.crmcore.dto.DashboardStats;
import com.precisioncrm.crmcore.repository.CandidateRepository;
import com.precisioncrm.crmcore.repository.JobOrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "http://localhost:5173")
public class DashboardController {

    @Autowired
    private CandidateRepository candidateRepository;

    @Autowired
    private JobOrderRepository jobOrderRepository;

    @GetMapping
    public DashboardStats getStats() {
        DashboardStats stats = new DashboardStats();
        
        // Count Active Stats (Assuming 'New' and 'Interviewing' are active for now)
        // If status fields are strictly 'Active', change here. 
        // Based on UI pill classes, status can be 'New', 'Interviewing', 'Offer'.
        // We'll count everything except 'Rejected' as "Active" or just all for simplicity if status is free-text.
        // For MVP, let's just count ALL candidates as "Active Database".
        stats.setActiveCandidates(candidateRepository.count());
        
        stats.setOpenJobOrders(jobOrderRepository.countByStatus("Open"));
        
        // "Interviews Scheduled" - approximation via Candidate status 'Interviewing'
        try {
             stats.setInterviewsScheduled(candidateRepository.countByStatus("Interviewing"));
        } catch (Exception e) {
             stats.setInterviewsScheduled(0);
        }

        // Recent Items for Activity Feed tables
        stats.setRecentCandidates(candidateRepository.findTop5ByOrderByIdDesc());
        stats.setRecentJobs(jobOrderRepository.findTop5ByOrderByCreatedDateDesc());

        return stats;
    }
}
