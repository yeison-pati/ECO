package com.itm.ecosurprise.models;

import jakarta.persistence.*;
import lombok.Data;

/*
 * @Data crea automaticamente getters y setters
 * @Entity indica que es una entidad de JPA
 * @Table indica el nombre de la tabla en la base de datos
 */
@Entity
@Table(name = "entregaDireccion")
@Data
public class EntregaDireccion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int idEntregaDireccion;

    @ManyToOne
    @JoinColumn(name = "idEntrega")
    private Entrega entrega;

    @OneToOne
    private Direccion direccion;

    private String tipo;
}
