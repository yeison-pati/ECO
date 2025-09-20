package com.itm.ecosurprise.models;

import jakarta.persistence.*;
import lombok.Data;
/*
 * @EqualsAndHashCode(callSuper = true) permite usar el constructor de la clase padre
 * @Data crea automaticamente getters y setters
 * @Entity indica que es una entidad de JPA
 * @Table indica el nombre de la tabla en la base de datos
 * @Column indica el nombre de la columna en la base de datos 
 */
@Data
@Entity
@Table(name = "direcciones")
public class Direccion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idDireccion")
    private int idDireccion;

    private String nombre;
    private String domicilio;
}
