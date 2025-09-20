package com.itm.ecosurprise.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.itm.ecosurprise.models.Consumidor;
import com.itm.ecosurprise.models.Direccion;
import com.itm.ecosurprise.models.UsuarioDireccion;
import com.itm.ecosurprise.repositories.IConsumidor;
import com.itm.ecosurprise.repositories.IUsuarioDireccion;

@Service
public class UsuarioDireccionService {

    @Autowired
    private IConsumidor consumidorRepository;
    @Autowired
    private IUsuarioDireccion usuarioDireccionRepository;
    @Autowired
    private DireccionService direccionService;

    /**
     * Crea una nueva relación entre un usuario y una dirección.
     * Asocia un consumidor (usuario) con una dirección mediante la entidad UsuarioDireccion.
     *
     * @param idUsuario El ID del usuario al que se asignará la dirección.
     * @param direccion El objeto `Direccion` que se asignará al usuario.
     * @return Una respuesta HTTP con la relación creada, o un error si el usuario no existe.
     */
    public ResponseEntity<?> crear(int idUsuario, Direccion direccion) {
        try {
            // Crear nueva instancia de UsuarioDireccion
            UsuarioDireccion usuarioDireccion = new UsuarioDireccion();
            
            // Obtener el consumidor (usuario) desde el repositorio
            Consumidor consumidor = consumidorRepository.findById(idUsuario)
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
            
            // Asignar el usuario y la dirección a la entidad UsuarioDireccion
            usuarioDireccion.setUsuario(consumidor);
            usuarioDireccion.setDireccion(direccionService.crear(direccion)); // Crear dirección
            
            // Guardar la relación en el repositorio y devolver la respuesta
            return ResponseEntity.ok(usuarioDireccionRepository.save(usuarioDireccion));
        } catch (Exception e) {
            // Si ocurre un error, devolver respuesta HTTP con el error
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
}
