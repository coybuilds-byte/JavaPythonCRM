package com.precisioncrm.crmcore.controller;

import com.precisioncrm.crmcore.model.Activity;
import com.precisioncrm.crmcore.repository.ActivityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/activities")
public class ActivityController {

    @Autowired
    private ActivityRepository activityRepository;

    @GetMapping
    public List<Activity> getAll() {
        return activityRepository.findAll();
    }

    @GetMapping("/candidate/{candidateId}")
    public List<Activity> getByCandidate(@PathVariable Long candidateId) {
        return activityRepository.findByCandidateId(candidateId);
    }

    @GetMapping("/client/{clientId}")
    public List<Activity> getByClient(@PathVariable Long clientId) {
        return activityRepository.findByClientId(clientId);
    }

    @PostMapping
    public Activity create(@RequestBody Activity activity) {
        return activityRepository.save(activity);
    }
}
