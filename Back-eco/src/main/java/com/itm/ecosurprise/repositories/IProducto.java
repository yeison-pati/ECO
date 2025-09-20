package com.itm.ecosurprise.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.itm.ecosurprise.models.Producto;

@Repository
public interface IProducto extends JpaRepository<Producto, Integer> {

}
