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
            com.precisioncrm.crmcore.model.Client client = clientRepository.findById(jobOrder.getClient().getId()).orElse(null);
            if(client == null) return ResponseEntity.badRequest().body("Client not found");
            jobOrder.setClient(client);
        }
        return ResponseEntity.ok(jobOrderRepository.save(jobOrder));
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
                    
                    if(jobOrderDetails.getClient() != null && jobOrderDetails.getClient().getId() != null) {
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

    @PostMapping("/{jobId}/candidates/{candidateId}")
    public ResponseEntity<JobOrder> addCandidate(@PathVariable Long jobId, @PathVariable Long candidateId) {
        return jobOrderRepository.findById(jobId)
            .map(jobOrder -> {
                return candidateRepository.findById(candidateId)
                    .map(candidate -> {
                        jobOrder.getCandidates().add(candidate);
                        return ResponseEntity.ok(jobOrderRepository.save(jobOrder));
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
