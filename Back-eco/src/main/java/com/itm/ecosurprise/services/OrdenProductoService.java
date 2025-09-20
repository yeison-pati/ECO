package com.itm.ecosurprise.services;

import com.itm.ecosurprise.models.OrdenProducto;
import com.itm.ecosurprise.repositories.IOrdenProducto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class OrdenProductoService {

    @Autowired
    private IOrdenProducto ordenProductoRepository;

    /**
     * Crea una nueva orden de producto y la guarda en el repositorio.
     *
     * @param ordenProducto El objeto de tipo OrdenProducto a crear.
     * @return El objeto OrdenProducto creado y guardado en la base de datos.
     */
    public OrdenProducto crear(OrdenProducto ordenProducto) {
        return ordenProductoRepository.save(ordenProducto);
    }
}
