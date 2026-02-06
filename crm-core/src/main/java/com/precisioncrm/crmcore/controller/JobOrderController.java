package com.precisioncrm.crmcore.controller;

import com.precisioncrm.crmcore.model.JobOrder;
import com.precisioncrm.crmcore.repository.JobOrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/job-orders")
public class JobOrderController {

    @Autowired
    private JobOrderRepository jobOrderRepository;

    @Autowired
    private com.precisioncrm.crmcore.service.NotificationService notificationService;

    @GetMapping
    public List<JobOrder> getAll() {
        return jobOrderRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<JobOrder> getById(@PathVariable Long id) {
        return jobOrderRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/client/{clientId}")
    public List<JobOrder> getByClient(@PathVariable Long clientId) {
        return jobOrderRepository.findByClientId(clientId);
    }

    @Autowired
    private com.precisioncrm.crmcore.repository.ClientRepository clientRepository;

    @PostMapping
    public ResponseEntity<?> create(@RequestBody JobOrder jobOrder) {
        if (jobOrder.getClient() != null && jobOrder.getClient().getId() != null) {
            com.precisioncrm.crmcore.model.Client client = clientRepository.findById(jobOrder.getClient().getId())
                    .orElse(null);
            if (client == null)
                return ResponseEntity.badRequest().body("Client not found");
            jobOrder.setClient(client);
        }
        JobOrder saved = jobOrderRepository.save(jobOrder);
        notificationService.createNotification("SYSTEM",
                "New Job Order: " + saved.getTitle() + " for "
                        + (saved.getClient() != null ? saved.getClient().getCompanyName() : "Unknown Client"),
                "JOB", saved.getId());
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<JobOrder> update(@PathVariable Long id, @RequestBody JobOrder jobOrderDetails) {
        return jobOrderRepository.findById(id)
                .map(jobOrder -> {
                    jobOrder.setTitle(jobOrderDetails.getTitle());
                    jobOrder.setStatus(jobOrderDetails.getStatus());
                    jobOrder.setOpenPositions(jobOrderDetails.getOpenPositions());
                    jobOrder.setDescription(jobOrderDetails.getDescription());
                    jobOrder.setSizzle(jobOrderDetails.getSizzle());

                    if (jobOrderDetails.getClient() != null && jobOrderDetails.getClient().getId() != null) {
                        // Ideally verify client exists
                        clientRepository.findById(jobOrderDetails.getClient().getId())
                                .ifPresent(jobOrder::setClient);
                    }

                    return ResponseEntity.ok(jobOrderRepository.save(jobOrder));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @Autowired
    private com.precisioncrm.crmcore.repository.CandidateRepository candidateRepository;

    @Autowired
    private com.precisioncrm.crmcore.repository.JobApplicationRepository jobApplicationRepository;

    @PostMapping("/{jobId}/candidates/{candidateId}")
    public ResponseEntity<?> addCandidate(@PathVariable Long jobId, @PathVariable Long candidateId) {
        return jobOrderRepository.findById(jobId)
                .map(jobOrder -> {
                    return candidateRepository.findById(candidateId)
                            .map(candidate -> {
                                // Check if already applied
                                boolean exists = jobOrder.getApplications().stream()
                                        .anyMatch(app -> app.getCandidate().getId().equals(candidateId));

                                if (exists) {
                                    return ResponseEntity.badRequest().body("Candidate already applied to this job");
                                }

                                com.precisioncrm.crmcore.model.JobApplication application = new com.precisioncrm.crmcore.model.JobApplication();
                                application.setJobOrder(jobOrder);
                                application.setCandidate(candidate);
                                application.setStatus(
                                        com.precisioncrm.crmcore.model.JobApplication.ApplicationStatus.APPLIED);

                                jobApplicationRepository.save(application);

                                return ResponseEntity.ok(jobOrderRepository.save(jobOrder)); // Return updated job
                            }).orElse(ResponseEntity.notFound().build());
                }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (jobOrderRepository.existsById(id)) {
            jobOrderRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}
