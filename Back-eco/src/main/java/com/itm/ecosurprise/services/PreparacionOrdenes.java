package com.itm.ecosurprise.services;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.itm.ecosurprise.dtos.OrdenesPrepDTO;
import com.itm.ecosurprise.models.Orden;
import com.itm.ecosurprise.repositories.IComerciante;
import com.itm.ecosurprise.repositories.IOrden;

@Service
public class PreparacionOrdenes {

    @Autowired
    private IComerciante comercianteRepository;
    @Autowired
    private IOrden ordenRepository;
    @Autowired
    private OrdenService ordenService;

    private final Map<Integer, OrdenesPrepDTO> ordenesPrep = new HashMap<>();

    public OrdenesPrepDTO obtenerOrdenesPrep(int idComerciante) {
        comercianteRepository.findById(idComerciante)
                .orElseThrow(() -> new RuntimeException(
                        "Consumidor no encontrado"));
        return ordenesPrep.computeIfAbsent(idComerciante, id -> new OrdenesPrepDTO());
    }

    public ResponseEntity<?> agregarOrden(int idComerciante, int idOrden) {
        try {

            comercianteRepository.findById(idComerciante)
                    .orElseThrow(() -> new RuntimeException(
                            "Comerciante no encontrado "));

            Orden ordenExistente = ordenRepository.findById(idOrden)
                    .orElseThrow(() -> new RuntimeException(
                            "Orden no encontrada"));

            OrdenesPrepDTO ordenes = obtenerOrdenesPrep(idComerciante);
            ordenes.getOrdenes().add(ordenService.confirmar(ordenExistente.getIdOrden()));

            return ResponseEntity.ok(ordenes);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    public ResponseEntity<?> obtenerOrdenes(int idComerciante) {
        try {
            OrdenesPrepDTO ordenes = obtenerOrdenesPrep(idComerciante);
            return ResponseEntity.ok(ordenes);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    public ResponseEntity<?> obtenerOrden(int idComerciante, int idOrden) {
        try {
            OrdenesPrepDTO ordenes = obtenerOrdenesPrep(idComerciante);
            Orden orden = ordenes.getOrdenes().stream()
                    .filter(o -> o.getIdOrden() == idOrden)
                    .findFirst()
                    .orElseThrow(() -> new RuntimeException("Orden no encontrada o no pertenece al comerciante"));

            return ResponseEntity.ok(orden);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
}
