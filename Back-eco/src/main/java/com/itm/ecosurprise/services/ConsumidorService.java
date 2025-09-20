package com.itm.ecosurprise.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.itm.ecosurprise.models.Consumidor;
import com.itm.ecosurprise.repositories.IConsumidor;

@Service
public class ConsumidorService {

    @Autowired
    private IConsumidor consumidorRepository; // Repositorio para gestionar la entidad Consumidor


    /**
     * Obtiene todos los consumidores registrados en la base de datos.
     * @return ResponseEntity con la lista de consumidores o el error si ocurre una excepción.
     */
    public ResponseEntity<?> obtenerTodos() {
        try {
            return ResponseEntity.ok(consumidorRepository.findAll());
        } catch (Exception e) {
            // Cambiado de 404 a 500 porque es un error interno del servidor, no "no encontrado"
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    /**
     * Obtiene un consumidor por su ID.
     * @param idConsumidor ID del consumidor a buscar.
     * @return ResponseEntity con el consumidor encontrado o el error si no se encuentra.
     */
    public ResponseEntity<?> obtenerPorId(int idConsumidor){
        try {
            return ResponseEntity.ok(consumidorRepository.findById(idConsumidor)
                    .orElseThrow(() -> new RuntimeException("Consumidor no encontrado con ID: " + idConsumidor)));
        } catch (Exception e) {
            // 404 es correcto aquí porque estamos buscando un recurso específico
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    /**
     * Elimina un consumidor por su ID.
     * @param id ID del consumidor a eliminar.
     * @return ResponseEntity con un mensaje de éxito o el error si ocurre una excepción.
     */
    public ResponseEntity<?> eliminar(int id) {
        try {
            // Verificar primero si existe el consumidor
            if (!consumidorRepository.existsById(id)) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Consumidor no encontrado con ID: " + id);
            }
            consumidorRepository.deleteById(id);
            // Para eliminaciones exitosas, se recomienda usar 204 No Content
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        } catch (Exception e) {
            // Si ocurre otro tipo de error, es mejor usar 500
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    /**
     * Actualiza los datos de un consumidor existente.
     * @param id ID del consumidor a actualizar.
     * @param consumidor Objeto con los nuevos datos del consumidor.
     * @return ResponseEntity con el consumidor actualizado o el error si ocurre una excepción.
     */
    public ResponseEntity<?> actualizar(int id, Consumidor consumidor) {
        try {
            Consumidor consumidorexistente = consumidorRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Consumidor no encontrado con ID: " + id));
            consumidorexistente.setNombre(consumidor.getNombre()); // Actualizar el nombre del consumidor
            return ResponseEntity.ok(consumidorRepository.save(consumidorexistente)); // Guardar el consumidor actualizado
        } catch (Exception e) {
            // Si no se encuentra, es 404, pero otros errores deberían ser 500
            if (e.getMessage().contains("no encontrado")) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
            }
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }
}