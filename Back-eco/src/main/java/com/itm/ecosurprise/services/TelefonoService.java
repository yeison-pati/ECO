package com.itm.ecosurprise.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.itm.ecosurprise.models.Telefono;
import com.itm.ecosurprise.models.Usuario;
import com.itm.ecosurprise.repositories.ITelefono;
import com.itm.ecosurprise.repositories.IUsuario;

@Service
public class TelefonoService {

    @Autowired
    private ITelefono telefonoRepository;
    @Autowired
    private IUsuario usuarioRepository;

    /**
     * Obtiene una lista de todos los teléfonos almacenados en el repositorio.
     *
     * @return Una lista de objetos `Telefono`.
     */
    public List<Telefono> obtenerTodos() {
        return telefonoRepository.findAll();
    }

    /**
     * Obtiene un teléfono específico por su ID.
     *
     * @param idTelefono El ID del teléfono a obtener.
     * @return El objeto `Telefono` correspondiente al ID proporcionado.
     * @throws RuntimeException Si no se encuentra el teléfono con el ID dado.
     */
    public Telefono obtenerXID(int idTelefono) {
        return telefonoRepository.findById(idTelefono)
                .orElseThrow(() -> new RuntimeException("Comerciante no encontrado con ID: " + idTelefono));
    }

    /**
     * Crea un nuevo teléfono y lo asocia a un usuario.
     *
     * @param idUsuario El ID del usuario al que se asignará el teléfono.
     * @param telefono El objeto `Telefono` a crear.
     * @return Una respuesta HTTP con el teléfono creado, o un error si ya existe un teléfono asignado al usuario.
     */
    public ResponseEntity<?> crear(int idUsuario, Telefono telefono) {
        try {
            // Obtener el usuario por su ID
            Usuario usuario = usuarioRepository.findById(idUsuario)
                    .orElseThrow(() -> new RuntimeException("Error al obtener usuario"));

            // Verificar si el usuario ya tiene un teléfono asignado
            if (usuario.getTelefono() != null) {
                // Cambiado a 409 Conflict - es más apropiado para recursos que ya existen
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body("El " + usuario.getRol() + " ya tiene un teléfono asignado.");
            }

            // Asociar el teléfono al usuario
            telefono.setUsuario(usuario);
            // Para creaciones exitosas se recomienda usar 201 Created
            return ResponseEntity.status(HttpStatus.CREATED).body(telefonoRepository.save(telefono));
        } catch (Exception e) {
            // Diferenciamos entre "no encontrado" y otros errores
            if (e.getMessage().contains("obtener usuario")) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
            }
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    /**
     * Actualiza la información de un teléfono existente.
     *
     * @param telefono El objeto `Telefono` con los nuevos valores a actualizar.
     * @return El objeto `Telefono` actualizado.
     */
    public Telefono actualizar(Telefono telefono) {
        return telefonoRepository.save(telefono);
    }

    /**
     * Elimina un teléfono por su ID.
     *
     * @param id El ID del teléfono a eliminar.
     * @return Un mensaje indicando que el teléfono ha sido eliminado con éxito.
     */
    public String eliminar(int id) {
        telefonoRepository.deleteById(id);
        return "Teléfono eliminado con éxito";
    }
}