package com.precisioncrm.crmcore.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "job_orders")
public class JobOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String status; // Open, Closed, In Progress
    private Integer openPositions;
    private LocalDateTime createdDate;
    
    @Lob
    @Column(columnDefinition = "TEXT")
    private String description;

    @ManyToOne
    @JoinColumn(name = "client_id")
    private Client client;

    @ManyToMany
    @JoinTable(
      name = "job_order_candidates", 
      joinColumns = @JoinColumn(name = "job_order_id"), 
      inverseJoinColumns = @JoinColumn(name = "candidate_id"))
    private List<Candidate> candidates;

    @PrePersist
    protected void onCreate() {
        createdDate = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public Integer getOpenPositions() { return openPositions; }
    public void setOpenPositions(Integer openPositions) { this.openPositions = openPositions; }
    public LocalDateTime getCreatedDate() { return createdDate; }
    public void setCreatedDate(LocalDateTime createdDate) { this.createdDate = createdDate; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public Client getClient() { return client; }
    public void setClient(Client client) { this.client = client; }
    public List<Candidate> getCandidates() { return candidates; }
    public void setCandidates(List<Candidate> candidates) { this.candidates = candidates; }
}
