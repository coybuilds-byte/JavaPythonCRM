package com.precisioncrm.crmcore.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/api/candidates")
public class CandidateController {

    @GetMapping("/health")
    public String health() {
        return "Candidate Service is Online";
    }

    @PostMapping("/parse")
    public ResponseEntity<String> parseResume(@RequestParam("file") MultipartFile file) {
        // TODO: Integrate with Python AI Service
        return ResponseEntity.ok("Resume parsing initiated for: " + file.getOriginalFilename());
    }
}
