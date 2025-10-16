package com.itm.ecosurprise.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.itm.ecosurprise.models.Producto;

@Repository
public interface IProducto extends JpaRepository<Producto, Integer> {

    @Query("SELECT p FROM Producto p WHERE p.comerciante.idUsuario = :idComerciante")
    List<Producto> findByComercianteId(@Param("idComerciante") int idComerciante);

}
