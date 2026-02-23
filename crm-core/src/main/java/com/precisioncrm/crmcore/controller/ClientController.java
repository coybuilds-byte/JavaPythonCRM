package com.precisioncrm.crmcore.controller;

import com.precisioncrm.crmcore.model.Client;
import com.precisioncrm.crmcore.repository.ClientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/clients")
public class ClientController {

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private com.precisioncrm.crmcore.service.NotificationService notificationService;

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

    @PostMapping("/import")
    public ResponseEntity<?> importClients(@RequestParam("file") MultipartFile file,
            java.security.Principal principal) {
        try (Workbook workbook = new XSSFWorkbook(file.getInputStream())) {
            Sheet sheet = workbook.getSheetAt(0);
            List<Client> importedClients = new ArrayList<>();
            DataFormatter dataFormatter = new DataFormatter(); // Robust formatter

            for (Row row : sheet) {
                if (row.getRowNum() == 0)
                    continue; // Skip header

                // Skip partial/empty rows
                if (row.getCell(0) == null)
                    continue;

                Client client = new Client();
                // Assumed Columns: Company Name (0), Contact Person (1), Email (2), Phone (3),
                // Address (4), City (5), State (6), Zip (7)

                String company = dataFormatter.formatCellValue(row.getCell(0));
                if (company.trim().isEmpty())
                    continue;

                client.setCompanyName(company);
                client.setContactPerson(dataFormatter.formatCellValue(row.getCell(1)));
                client.setEmail(dataFormatter.formatCellValue(row.getCell(2)));
                client.setPhone(dataFormatter.formatCellValue(row.getCell(3)));
                client.setAddress(dataFormatter.formatCellValue(row.getCell(4)));
                client.setCity(dataFormatter.formatCellValue(row.getCell(5)));
                client.setState(dataFormatter.formatCellValue(row.getCell(6)));
                client.setZip(dataFormatter.formatCellValue(row.getCell(7)));

                if (principal != null)
                    client.setOwner(principal.getName());

                importedClients.add(client);
            }
            clientRepository.saveAll(importedClients);
            return ResponseEntity.ok("Imported " + importedClients.size() + " clients.");
        } catch (IOException e) {
            System.err.println("Excel import error: " + e.getMessage());
            return ResponseEntity.badRequest()
                    .body("Failed to parse Excel file. Please ensure it follows the required format.");
        }
    }

    // Removed manual getCellValue method as it is replaced by dataFormatter

    @PostMapping
    public Client create(@RequestBody Client client, java.security.Principal principal) {
        if (principal != null) {
            client.setOwner(principal.getName());
        }
        Client saved = clientRepository.save(client);
        notificationService.createNotification("SYSTEM", "New client added: " + saved.getCompanyName(), "CLIENT",
                saved.getId());
        return saved;
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody Client clientDetails,
            java.security.Principal principal) {
        return clientRepository.findById(id)
                .map(client -> {
                    // Ownership check
                    if (clientDetails.getOwner() != null && !clientDetails.getOwner().equals(client.getOwner())) {
                        boolean isAdmin = principal != null && principal.getName().contains("jesse");
                        if (isAdmin) {
                            client.setOwner(clientDetails.getOwner());
                        }
                    }

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
                    client.setSizzle(clientDetails.getSizzle());
                    // client.setContacts(clientDetails.getContacts()); // Be careful with lists,
                    // for now let's skip auto-update of list in main PUT and use specialized
                    // endpoint if needed, OR just set it if frontend sends full list.
                    // Given the frontend code doesn't send contacts back in the PUT for
                    // Sizzle/Logo, this is safe to omit or safe to include if null check.
                    // Actually, if we want to save sizzle, we just need setSizzle.
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
