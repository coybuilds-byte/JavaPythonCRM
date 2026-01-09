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

    @PostMapping
    public JobOrder create(@RequestBody JobOrder jobOrder) {
        return jobOrderRepository.save(jobOrder);
    }

    @PutMapping("/{id}")
    public ResponseEntity<JobOrder> update(@PathVariable Long id, @RequestBody JobOrder jobOrderDetails) {
        return jobOrderRepository.findById(id)
                .map(jobOrder -> {
                    jobOrder.setTitle(jobOrderDetails.getTitle());
                    jobOrder.setStatus(jobOrderDetails.getStatus());
                    jobOrder.setOpenPositions(jobOrderDetails.getOpenPositions());
                    jobOrder.setDescription(jobOrderDetails.getDescription());
                    // Client linkage usually handled by passing client object or ID, 
                    // assuming basic binding here for now
                    if(jobOrderDetails.getClient() != null) jobOrder.setClient(jobOrderDetails.getClient());
                    return ResponseEntity.ok(jobOrderRepository.save(jobOrder));
                })
                .orElse(ResponseEntity.notFound().build());
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
