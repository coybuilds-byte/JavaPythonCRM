package com.precisioncrm.crmcore.repository;

import com.precisioncrm.crmcore.model.ClientContact;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClientContactRepository extends JpaRepository<ClientContact, Long> {
    List<ClientContact> findByClientId(Long clientId);
}
