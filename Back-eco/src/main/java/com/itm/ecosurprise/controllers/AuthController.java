package com.itm.ecosurprise.controllers;

import com.itm.ecosurprise.services.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    public AuthController(AuthService authService) {
        this.authService = authService;
    }
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        System.out.println("Login request: " + credentials);
        return authService.login(credentials.get("correo"), credentials.get("contrasena"));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, Object> userData) {
        return authService.register(userData);
    }

    @PostMapping("/validate-token")
    public ResponseEntity<?> validateToken(@RequestHeader("Authorization") String authHeader) {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            boolean isValid = authService.validateToken(token);
            
            if (isValid) {
                // Si el token es válido, generar uno nuevo
                String newToken = authService.renewToken(token);
                return ResponseEntity.ok(Map.of(
                    "valid", true,
                    "token", newToken
                ));
            }
        }
        return ResponseEntity.ok(Map.of("valid", false));
    }
} 