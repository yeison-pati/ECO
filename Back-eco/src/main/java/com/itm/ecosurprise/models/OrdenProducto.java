package com.itm.ecosurprise.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.*;
import lombok.Data;


/*
 * @Data crea automaticamente getters y setters
 * @Entity indica que es una entidad de JPA
 * @Table indica el nombre de la tabla en la base de datos
 * @JsonIgnoreProperties se usa para evitar la recursividad infinita al obtener jsons
 * @CascadeType.ALL indica que se aplicaran todas las operaciones de persistencia a los objetos relacionados
 * @ManyToOne indica que hay una relacion de muchos a uno entre las entidades
 * @JoinColumn indica la columna de la tabla que se usara para la relacion
 */
@Data
@Entity
@Table(name = "ordenProducto")
public class OrdenProducto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int idOrdenProducto;

    @ManyToOne
    @JoinColumn(name = "idOrden")
    @JsonIgnoreProperties(value = {
		"fechaOrden", "direccionEntrega", "productos", "estadoOrden", "pago", "consumidor"
    })
    private Orden orden;

    @ManyToOne
    @JoinColumn(name = "idProducto")
    @JsonIgnoreProperties(value = {
        "comerciante", "descripcion", "puntuaciones"
    })
    private Producto producto;

}