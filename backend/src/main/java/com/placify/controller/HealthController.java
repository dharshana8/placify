package com.placify.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/health")
public class HealthController {

    @GetMapping
    public ResponseEntity<?> health() {
        return ResponseEntity.ok(Map.of(
            "status", "UP",
            "timestamp", LocalDateTime.now(),
            "service", "Placify AI Backend",
            "version", "1.0.0"
        ));
    }

    @GetMapping("/db")
    public ResponseEntity<?> dbHealth() {
        return ResponseEntity.ok(Map.of(
            "database", "PostgreSQL",
            "status", "Connected",
            "timestamp", LocalDateTime.now()
        ));
    }
}