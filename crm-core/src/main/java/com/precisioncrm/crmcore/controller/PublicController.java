package com.precisioncrm.crmcore.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/public")
public class PublicController {

    @Value("${AI_SERVICE_URL:http://localhost:8000}")
    private String aiServiceUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    @GetMapping("/diagnose")
    public ResponseEntity<Map<String, Object>> diagnoseConnection() {
        Map<String, Object> response = new HashMap<>();
        response.put("configuredUrl", aiServiceUrl);

        try {
            String healthUrl = aiServiceUrl + "/health";
            String healthResponse = restTemplate.getForObject(healthUrl, String.class);
            response.put("status", "Success");
            response.put("aiServiceResponse", healthResponse);
        } catch (Exception e) {
            System.err.println("Public diagnosis error: " + e.getMessage());
            response.put("status", "Failure");
            response.put("error", "Failed to connect to AI Service. Please check server logs.");
        }

        return ResponseEntity.ok(response);
    }
}
