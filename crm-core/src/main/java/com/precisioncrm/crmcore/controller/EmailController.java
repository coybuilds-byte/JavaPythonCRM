package com.precisioncrm.crmcore.controller;

import com.precisioncrm.crmcore.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/email")
public class EmailController {

    @Autowired
    private EmailService emailService;

    @PostMapping("/send")
    public ResponseEntity<String> sendEmail(@RequestBody Map<String, String> payload) {
        try {
            String to = payload.get("to");
            String subject = payload.get("subject");
            String body = payload.get("body");

            if (to == null || subject == null || body == null) {
                return ResponseEntity.badRequest().body("Missing to, subject, or body");
            }

            emailService.sendSimpleMessage(to, subject, body);
            return ResponseEntity.ok("Email sent successfully");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Failed to send email: " + e.getMessage());
        }
    }
}
