package com.precisioncrm.crmcore.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/recruiters")
public class RecruiterController {

    @GetMapping("/health")
    public String health() {
        return "Recruiter Service is Online";
    }
}
