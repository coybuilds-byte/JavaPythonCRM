package com.precisioncrm.crmcore.dto;

import com.precisioncrm.crmcore.model.Candidate;
import com.precisioncrm.crmcore.model.JobOrder;
import java.util.List;

public class DashboardStats {
    private long activeCandidates;
    private long openJobOrders;
    private long interviewsScheduled;
    
    private List<Candidate> recentCandidates;
    private List<JobOrder> recentJobs;

    // Getters and Setters
    public long getActiveCandidates() { return activeCandidates; }
    public void setActiveCandidates(long activeCandidates) { this.activeCandidates = activeCandidates; }
    
    public long getOpenJobOrders() { return openJobOrders; }
    public void setOpenJobOrders(long openJobOrders) { this.openJobOrders = openJobOrders; }
    
    public long getInterviewsScheduled() { return interviewsScheduled; }
    public void setInterviewsScheduled(long interviewsScheduled) { this.interviewsScheduled = interviewsScheduled; }
    
    public List<Candidate> getRecentCandidates() { return recentCandidates; }
    public void setRecentCandidates(List<Candidate> recentCandidates) { this.recentCandidates = recentCandidates; }
    
    public List<JobOrder> getRecentJobs() { return recentJobs; }
    public void setRecentJobs(List<JobOrder> recentJobs) { this.recentJobs = recentJobs; }
}
