package com.precisioncrm.crmcore.controller;

import com.precisioncrm.crmcore.model.Client;
import com.precisioncrm.crmcore.model.ClientContact;
import com.precisioncrm.crmcore.repository.ClientContactRepository;
import com.precisioncrm.crmcore.repository.ClientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/contacts")
public class ClientContactController {

    @Autowired
    private ClientContactRepository contactRepository;

    @Autowired
    private ClientRepository clientRepository;

    @GetMapping("/client/{clientId}")
    public List<ClientContact> getByClient(@PathVariable Long clientId) {
        return contactRepository.findByClientId(clientId);
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody ClientContact contact) {
        if (contact.getClient() != null && contact.getClient().getId() != null) {
            Client client = clientRepository.findById(contact.getClient().getId()).orElse(null);
            if (client == null) {
                return ResponseEntity.badRequest().body("Client not found");
            }
            contact.setClient(client);
        }
        return ResponseEntity.ok(contactRepository.save(contact));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody ClientContact details) {
        return contactRepository.findById(id)
                .map(contact -> {
                    contact.setName(details.getName());
                    contact.setRole(details.getRole());
                    contact.setEmail(details.getEmail());
                    contact.setPhone(details.getPhone());
                    contact.setNotes(details.getNotes());
                    contact.setPreferred(details.isPreferred());
                    return ResponseEntity.ok(contactRepository.save(contact));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        if (contactRepository.existsById(id)) {
            contactRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}
