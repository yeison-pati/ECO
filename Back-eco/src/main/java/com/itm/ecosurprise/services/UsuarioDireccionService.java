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

            UsuarioDireccion usuarioDireccion = new UsuarioDireccion();
            

            Consumidor consumidor = consumidorRepository.findById(idUsuario)
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
            

            usuarioDireccion.setUsuario(consumidor);
            usuarioDireccion.setDireccion(direccionService.crear(direccion));
            

            return ResponseEntity.ok(usuarioDireccionRepository.save(usuarioDireccion));
        } catch (Exception e) {

            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
}
