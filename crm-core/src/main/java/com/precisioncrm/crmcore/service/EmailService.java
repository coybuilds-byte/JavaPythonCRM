package com.precisioncrm.crmcore.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
public class EmailService {

    @Value("${resend.api.key}")
    private String resendApiKey;

    @Value("${email.provider:mock}")
    private String emailProvider;

    private final RestTemplate restTemplate = new RestTemplate();

    public void sendSimpleMessage(String to, String subject, String text) {
        if ("mock".equalsIgnoreCase(emailProvider)) {
            System.out.println("================ MOCK EMAIL SERVICE ================");
            System.out.println("To: " + to);
            System.out.println("Subject: " + subject);
            System.out.println("Body: " + text);
            System.out.println("====================================================");
            return;
        }

        String url = "https://api.resend.com/emails";

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + resendApiKey);
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> body = new HashMap<>();
        body.put("from", "jesse@precisionsourcemanagement.com");
        body.put("to", to);
        body.put("subject", subject);
        body.put("html", text.replace("\n", "<br>")); // Basic text to HTML conversion

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

        try {
            restTemplate.postForEntity(url, request, String.class);
            System.out.println("Email sent successfully via Resend to " + to);
        } catch (Exception e) {
            System.err.println("Error sending email via Resend: " + e.getMessage());
            if (e instanceof org.springframework.web.client.HttpClientErrorException) {
                System.err.println("Resend API Response Body: "
                        + ((org.springframework.web.client.HttpClientErrorException) e).getResponseBodyAsString());
            }
            e.printStackTrace();
            // Do NOT throw exception to prevent breaking the calling request
            System.err.println("Continuing despite email failure...");
        }
    }
}
