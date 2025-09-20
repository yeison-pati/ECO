package com.itm.ecosurprise.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;


/*
 * @Data crea automaticamente getters y setters
 * @Entity indica que es una entidad de JPA
 * @Table indica el nombre de la tabla en la base de datos
 * @JsonIgnoreProperties se usa para evitar la recursividad infinita al obtener jsons
 * @CascadeType.ALL indica que se aplicaran todas las operaciones de persistencia a los objetos relacionados
 * @OneToOne indica que hay una relacion de uno a uno entre las entidades
 * @JoinColumn indica la columna de la tabla que se usara para la relacion
 */
@Data
@Entity
@Table(name = "pago")
public class Pago {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int idPago;

    @OneToOne
    @JoinColumn(name = "idOrden")
    @JsonIgnoreProperties(value = {
		"direccionEntrega", "productos", "estadoOrden", "pago"
	  })
    @EqualsAndHashCode.Exclude
    private Orden orden;

    @OneToOne
    private Fecha fechaPago;
    private String estadoPago;
    private String metodoPago;
    private int montoPagado;
}

