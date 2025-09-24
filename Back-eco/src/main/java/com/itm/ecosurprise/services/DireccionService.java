package com.itm.ecosurprise.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.itm.ecosurprise.models.Direccion;
import com.itm.ecosurprise.repositories.IDireccion;

@Service
public class DireccionService {

    @Autowired
    private IDireccion direccionRepository;
    
    /**
     * Crea una nueva dirección y la guarda en la base de datos.
     * @param direccion Objeto Direccion con los datos a guardar.
     * @return La dirección guardada con su ID asignado.
     */
    public Direccion crear(Direccion direccion) {
        return direccionRepository.save(direccion);
    }

    /**
     * Elimina una dirección existente en la base de datos.
     * @param id ID de la dirección a eliminar.
     * @return Mensaje de éxito indicando que la dirección fue eliminada correctamente.
     */
    public String eliminar(int id) {
        direccionRepository.deleteById(id);
        return "Direccion eliminada con éxito";
    }
}
