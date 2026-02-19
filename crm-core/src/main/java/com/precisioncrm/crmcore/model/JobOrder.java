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

  @com.fasterxml.jackson.annotation.JsonIgnoreProperties("jobOrders")
  @ManyToOne
  @JoinColumn(name = "client_id")
  private Client client;

  @OneToMany(mappedBy = "jobOrder", cascade = CascadeType.ALL, orphanRemoval = true)
  @com.fasterxml.jackson.annotation.JsonIgnoreProperties("jobOrder")
  private List<JobApplication> applications;

  @PrePersist
  protected void onCreate() {
    createdDate = LocalDateTime.now();
  }

  // Getters and Setters
  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getTitle() {
    return title;
  }

  public void setTitle(String title) {
    this.title = title;
  }

  public String getStatus() {
    return status;
  }

  public void setStatus(String status) {
    this.status = status;
  }

  public Integer getOpenPositions() {
    return openPositions;
  }

  public void setOpenPositions(Integer openPositions) {
    this.openPositions = openPositions;
  }

  public LocalDateTime getCreatedDate() {
    return createdDate;
  }

  public void setCreatedDate(LocalDateTime createdDate) {
    this.createdDate = createdDate;
  }

  public String getDescription() {
    return description;
  }

  public void setDescription(String description) {
    this.description = description;
  }

  public Client getClient() {
    return client;
  }

  public void setClient(Client client) {
    this.client = client;
  }

  @Lob
  @Column(columnDefinition = "TEXT")
  private String sizzle;

  public List<JobApplication> getApplications() {
    return applications;
  }

  public void setApplications(List<JobApplication> applications) {
    this.applications = applications;
  }

  public String getSizzle() {
    return sizzle;
  }

  public void setSizzle(String sizzle) {
    this.sizzle = sizzle;
  }
}
