package com.itm.ecosurprise.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.itm.ecosurprise.models.Fecha;
import com.itm.ecosurprise.repositories.IFecha;

@Service
public class FechaService {

    @Autowired
    private IFecha fechaRepository; // Repositorio para gestionar la entidad Fecha
    
    /**
     * Crea una nueva fecha y la guarda en la base de datos.
     * @param fecha Objeto Fecha con los datos a guardar.
     * @return La fecha guardada con su ID asignado.
     */
    public Fecha crear(Fecha fecha) {
        return fechaRepository.save(fecha); // Guarda la fecha en la base de datos
    }

    /**
     * Elimina una fecha existente en la base de datos.
     * @param id ID de la fecha a eliminar.
     * @return Mensaje de éxito indicando que la fecha fue eliminada correctamente.
     */
    public String eliminar(int id) {
        fechaRepository.deleteById(id); // Elimina la fecha por ID
        return "Direccion eliminada con éxito"; // Mensaje de éxito (nota: podría mejorarse a 'Fecha eliminada con éxito')
    }
}
