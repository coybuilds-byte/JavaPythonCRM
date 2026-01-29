package com.precisioncrm.crmcore.model;

import jakarta.persistence.*;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "candidates")
public class Candidate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String email;
    private String phone;
    private String owner;
    
    // New Fields
    private String status; // e.g., 'Active', 'Placed', 'Interviewing'
    private String location;
    private String address; // Street address or more specific location
    private String cell; // Cell phone separate from primary phone
    private String currentTitle;
    private Integer yearsExperience;

    @ElementCollection
    private List<String> skills;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String resumeText;

    private String resumeFilePath;

    @JsonIgnore // Prevent infinite recursion if bidirectional
    @ManyToMany(mappedBy = "candidates")
    private List<JobOrder> jobOrders;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public String getCell() { return cell; }
    public void setCell(String cell) { this.cell = cell; }
    public String getCurrentTitle() { return currentTitle; }
    public void setCurrentTitle(String currentTitle) { this.currentTitle = currentTitle; }
    public Integer getYearsExperience() { return yearsExperience; }
    public void setYearsExperience(Integer yearsExperience) { this.yearsExperience = yearsExperience; }
    public List<String> getSkills() { return skills; }
    public void setSkills(List<String> skills) { this.skills = skills; }
    public String getResumeText() { return resumeText; }
    public void setResumeText(String resumeText) { this.resumeText = resumeText; }
    public String getResumeFilePath() { return resumeFilePath; }
    public void setResumeFilePath(String resumeFilePath) { this.resumeFilePath = resumeFilePath; }
    public List<JobOrder> getJobOrders() { return jobOrders; }
    public void setJobOrders(List<JobOrder> jobOrders) { this.jobOrders = jobOrders; }
    public String getOwner() { return owner; }
    public void setOwner(String owner) { this.owner = owner; }
}
