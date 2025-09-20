package com.itm.ecosurprise.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.itm.ecosurprise.models.Orden;

@Repository
public interface IOrden extends JpaRepository<Orden, Integer> {

    @Query("SELECT DISTINCT o FROM Orden o JOIN o.productos op WHERE op.producto.comerciante.idUsuario = :idComerciante")
    List<Orden> findAllByIdComerciante(int idComerciante);

    @Query("SELECT o FROM Orden o JOIN o.productos op WHERE o.idOrden = :idOrden AND op.producto.comerciante.idUsuario = :idComerciante")
    Orden findByIdAndComerciante(int idOrden, int idComerciante);
}
