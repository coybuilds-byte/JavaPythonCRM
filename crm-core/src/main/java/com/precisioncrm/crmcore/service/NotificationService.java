package com.precisioncrm.crmcore.service;

import com.precisioncrm.crmcore.model.Notification;
import com.precisioncrm.crmcore.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationService {
    @Autowired
    private NotificationRepository notificationRepository;

    public void createNotification(String type, String message, String entityType, Long entityId) {
        Notification n = new Notification();
        n.setType(type);
        n.setMessage(message);
        n.setEntityType(entityType);
        n.setEntityId(entityId);
        notificationRepository.save(n);
    }

    public List<Notification> getLatestNotifications() {
        return notificationRepository.findTop20ByOrderByCreatedAtDesc();
    }

    public void markAsRead(Long id) {
        notificationRepository.findById(id).ifPresent(n -> {
            n.setRead(true);
            notificationRepository.save(n);
        });
    }

    public void markAllAsRead() {
        List<Notification> all = notificationRepository.findAll();
        all.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(all);
    }
}
