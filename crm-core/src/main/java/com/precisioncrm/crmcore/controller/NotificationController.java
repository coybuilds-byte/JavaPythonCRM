package com.precisioncrm.crmcore.controller;

import com.precisioncrm.crmcore.model.Notification;
import com.precisioncrm.crmcore.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @GetMapping
    public List<Notification> getNotifications() {
        return notificationService.getLatestNotifications();
    }

    @PostMapping("/read/{id}")
    public ResponseEntity<Void> markAsRead(@PathVariable Long id) {
        notificationService.markAsRead(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/read-all")
    public ResponseEntity<Void> markAllAsRead() {
        notificationService.markAllAsRead();
        return ResponseEntity.ok().build();
    }

    @PostMapping("/broadcast")
    public ResponseEntity<Void> broadcast(@RequestBody Map<String, String> payload) {
        String message = payload.get("message");
        if(message != null && !message.isEmpty()) {
            notificationService.createNotification("TEAM", message, null, null);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.badRequest().build();
    }
}
