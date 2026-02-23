package com.precisioncrm.crmcore.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import java.util.HashMap;
import java.util.Map;

@Service
public class TeamsWebhookService {

    @Autowired
    private RestTemplate restTemplate;

    @Value("${teams.webhooks.candidate:}")
    private String candidateWebhookUrl;

    @Value("${teams.webhooks.job:}")
    private String jobWebhookUrl;

    public void sendCandidateAlert(String name, String email, String owner, Long id) {
        if (candidateWebhookUrl == null || candidateWebhookUrl.isEmpty())
            return;

        Map<String, String> payload = new HashMap<>();
        String message = String.format("👤 **New Candidate Added**\n\n" +
                "**Name:** %s\n" +
                "**Email:** %s\n" +
                "**Owner:** %s\n\n" +
                "[View Profile](https://psmtechstaffing.com/candidates/%d)",
                name, email, owner, id);

        payload.put("text", message);
        send(candidateWebhookUrl, payload);
    }

    public void sendJobOrderAlert(String title, String company, Long id) {
        if (jobWebhookUrl == null || jobWebhookUrl.isEmpty())
            return;

        Map<String, String> payload = new HashMap<>();
        String message = String.format("💼 **New Job Order Created**\n\n" +
                "**Title:** %s\n" +
                "**Client:** %s\n\n" +
                "[View Job](https://psmtechstaffing.com/job-orders)",
                title, company);

        payload.put("text", message);
        send(jobWebhookUrl, payload);
    }

    private void send(String url, Map<String, String> payload) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, String>> request = new HttpEntity<>(payload, headers);
            restTemplate.postForEntity(url, request, String.class);
        } catch (Exception e) {
            System.err.println("Failed to send Teams notification: " + e.getMessage());
        }
    }
}
