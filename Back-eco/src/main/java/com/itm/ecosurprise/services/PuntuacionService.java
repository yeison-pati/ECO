package com.itm.ecosurprise.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.itm.ecosurprise.models.Puntuacion;
import com.itm.ecosurprise.repositories.IPuntuacion;

public class PuntuacionService {
    
    @Autowired
    private IPuntuacion puntuacionRepository;

    public ResponseEntity<?> obtenerTodos() {
        try {
            return ResponseEntity.ok(puntuacionRepository.findAll());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }

    }

    public ResponseEntity<?> obtenerXID(int id) {
        try {
            return ResponseEntity.ok(puntuacionRepository.findById(id));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    public ResponseEntity<?> crear(Puntuacion puntuacion) {
        try {
            return ResponseEntity.ok(puntuacionRepository.save(puntuacion));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
}
