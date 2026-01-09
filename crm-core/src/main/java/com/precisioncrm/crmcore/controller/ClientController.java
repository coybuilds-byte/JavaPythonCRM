package com.precisioncrm.crmcore.controller;

import com.precisioncrm.crmcore.model.Client;
import com.precisioncrm.crmcore.repository.ClientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/clients")
public class ClientController {

    @Autowired
    private ClientRepository clientRepository;

    @GetMapping
    public List<Client> getAll() {
        return clientRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Client> getById(@PathVariable Long id) {
        return clientRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Client create(@RequestBody Client client) {
        return clientRepository.save(client);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Client> update(@PathVariable Long id, @RequestBody Client clientDetails) {
        return clientRepository.findById(id)
                .map(client -> {
                    client.setCompanyName(clientDetails.getCompanyName());
                    client.setIndustry(clientDetails.getIndustry());
                    client.setContactPerson(clientDetails.getContactPerson());
                    client.setEmail(clientDetails.getEmail());
                    client.setPhone(clientDetails.getPhone());
                    client.setAddress(clientDetails.getAddress());
                    client.setCity(clientDetails.getCity());
                    client.setState(clientDetails.getState());
                    client.setZip(clientDetails.getZip());
                    client.setLogoUrl(clientDetails.getLogoUrl());
                    return ResponseEntity.ok(clientRepository.save(client));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (clientRepository.existsById(id)) {
            clientRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}
