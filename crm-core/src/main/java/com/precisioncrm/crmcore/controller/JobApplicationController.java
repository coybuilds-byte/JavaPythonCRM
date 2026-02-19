package com.precisioncrm.crmcore.controller;

import com.precisioncrm.crmcore.model.JobApplication;
import com.precisioncrm.crmcore.repository.JobApplicationRepository;
import com.precisioncrm.crmcore.service.EmailService;
import com.precisioncrm.crmcore.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/applications")
public class JobApplicationController {

    @Autowired
    private JobApplicationRepository jobApplicationRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private NotificationService notificationService;

    @PutMapping("/{id}/status")
    public ResponseEntity<JobApplication> updateStatus(
            @PathVariable Long id,
            @RequestParam(defaultValue = "false") boolean sendPrepEmail,
            @RequestBody JobApplication updates) {
        return jobApplicationRepository.findById(id)
                .map(app -> {
                    app.setStatus(updates.getStatus());

                    // If updating interview details
                    if (updates.getInterviewDate() != null) {
                        app.setInterviewDate(updates.getInterviewDate());
                    }
                    if (updates.getInterviewLocation() != null) {
                        app.setInterviewLocation(updates.getInterviewLocation());
                    }
                    if (updates.getNotes() != null) {
                        app.setNotes(updates.getNotes());
                    }

                    JobApplication saved = jobApplicationRepository.save(app);

                    // Trigger Notifications based on status
                    String jobTitle = saved.getJobOrder().getTitle();
                    String candidateName = saved.getCandidate().getName();

                    if (saved.getStatus() == JobApplication.ApplicationStatus.INTERVIEW_SCHEDULED) {
                        String subject = "Interview Scheduled: " + candidateName;
                        String body = "Interview for " + jobTitle + " scheduled on " + saved.getInterviewDate()
                                + "\nLocation: " + saved.getInterviewLocation();

                        // Notify Recruiter
                        emailService.sendSimpleMessage("recruiter@precisionsourcemanagement.com", subject, body);

                        // Notify Candidate (Interview Prep) if requested
                        if (sendPrepEmail && saved.getCandidate().getEmail() != null) {
                            String prepSubject = "Interview Preparation: " + jobTitle;
                            String prepBody = "Dear " + candidateName + ",\n\n" +
                                    "Your interview for the " + jobTitle + " position has been scheduled.\n\n" +
                                    "**Time:** " + saved.getInterviewDate() + "\n" +
                                    "**Location:** " + saved.getInterviewLocation() + "\n\n" +
                                    "**Preparation Tips:**\n" +
                                    "- Please research our company values and recent projects.\n" +
                                    "- Be prepared to discuss your experience with "
                                    + (saved.getCandidate().getSkills() != null
                                            ? String.join(", ", saved.getCandidate().getSkills())
                                            : "relevant technologies")
                                    + ".\n" +
                                    "- Have your portfolio or code samples ready if applicable.\n\n" +
                                    "Good luck!\n\n" +
                                    "Best regards,\n" +
                                    "Precision Source Management";

                            emailService.sendSimpleMessage(saved.getCandidate().getEmail(), prepSubject, prepBody);
                            System.out.println("Prep email sent to candidate: " + saved.getCandidate().getEmail());
                        }
                    }

                    return ResponseEntity.ok(saved);
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
