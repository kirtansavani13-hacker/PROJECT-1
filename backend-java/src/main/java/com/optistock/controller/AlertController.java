package com.optistock.controller;

import com.optistock.model.SystemAlert;
import com.optistock.repository.AlertRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/alerts")
@CrossOrigin(origins = "*")
public class AlertController {

    @Autowired
    private AlertRepository alertRepository;

    @GetMapping
    public List<SystemAlert> getAllAlerts() {
        return alertRepository.findAll();
    }

    @PostMapping("/{id}/resolve")
    public ResponseEntity<SystemAlert> resolveAlert(@PathVariable String id) {
        return alertRepository.findById(id).map(alert -> {
            alert.setStatus("RESOLVED");
            SystemAlert saved = alertRepository.save(alert);
            return ResponseEntity.ok(saved);
        }).orElse(ResponseEntity.notFound().build());
    }
}
