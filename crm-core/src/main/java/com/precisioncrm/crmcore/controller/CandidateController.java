package com.precisioncrm.crmcore.controller;

import com.precisioncrm.crmcore.model.Candidate;
import com.precisioncrm.crmcore.repository.CandidateRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@RestController
@RequestMapping("/api/candidates")
public class CandidateController {

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private CandidateRepository candidateRepository;

    @Value("${AI_SERVICE_URL:http://localhost:8000}")
    private String aiServiceUrl;

    @GetMapping
    public List<Candidate> getAll() {
        return candidateRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Candidate> getById(@PathVariable Long id) {
        return candidateRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Candidate create(@RequestBody Candidate candidate) {
        return candidateRepository.save(candidate);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Candidate> update(@PathVariable Long id, @RequestBody Candidate candidateDetails) {
        return candidateRepository.findById(id)
                .map(candidate -> {
                    candidate.setName(candidateDetails.getName());
                    candidate.setEmail(candidateDetails.getEmail());
                    candidate.setPhone(candidateDetails.getPhone());
                    candidate.setStatus(candidateDetails.getStatus());
                    candidate.setLocation(candidateDetails.getLocation());
                    candidate.setCurrentTitle(candidateDetails.getCurrentTitle());
                    candidate.setYearsExperience(candidateDetails.getYearsExperience());
                    candidate.setSkills(candidateDetails.getSkills());
                    candidate.setResumeText(candidateDetails.getResumeText());
                    return ResponseEntity.ok(candidateRepository.save(candidate));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (candidateRepository.existsById(id)) {
            candidateRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/health")
    public String health() {
        return "Candidate Service is Online";
    }

    @PostMapping("/parse")
    public ResponseEntity<Candidate> parseResume(@RequestParam("file") MultipartFile file) {
        try {
            org.springframework.http.HttpHeaders headers = new org.springframework.http.HttpHeaders();
            headers.setContentType(org.springframework.http.MediaType.MULTIPART_FORM_DATA);

            org.springframework.util.MultiValueMap<String, Object> body = new org.springframework.util.LinkedMultiValueMap<>();
            body.add("file", file.getResource());

            org.springframework.http.HttpEntity<org.springframework.util.MultiValueMap<String, Object>> requestEntity = new org.springframework.http.HttpEntity<>(body, headers);

            String url = aiServiceUrl + "/parse-resume";
            ResponseEntity<String> response = restTemplate.postForEntity(url, requestEntity, String.class);
            
            if (response.getBody() == null) {
                return ResponseEntity.badRequest().build();
            }

            // Parse JSON response
            com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
            com.fasterxml.jackson.databind.JsonNode root = mapper.readTree(response.getBody());

            Candidate candidate = new Candidate();
            candidate.setName(root.path("name").asText());
            candidate.setEmail(root.path("email").asText());
            candidate.setPhone(root.path("phone").asText());
            // Map skills
            if (root.has("skills")) {
                java.util.List<String> skills = new java.util.ArrayList<>();
                root.path("skills").forEach(node -> skills.add(node.asText()));
                candidate.setSkills(skills);
            }
            candidate.setResumeText(root.path("text_content").asText());
            candidate.setStatus("New"); // Default status

            Candidate savedCandidate = candidateRepository.save(candidate);

            return ResponseEntity.ok(savedCandidate);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }
}
