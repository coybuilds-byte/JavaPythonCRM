package com.precisioncrm.crmcore.repository;

import com.precisioncrm.crmcore.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    // Fetch latest unread or recent notifications
    List<Notification> findTop20ByOrderByCreatedAtDesc();
    
    // Count unread
    long countByIsReadFalse();
}
