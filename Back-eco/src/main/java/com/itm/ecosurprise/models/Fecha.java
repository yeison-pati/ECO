package com.itm.ecosurprise.models;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;


/*
 * @Data crea automaticamente getters y setters
 * @Entity indica que es una entidad de JPA
 * @Table indica el nombre de la tabla en la base de datos
 */

@Data
@Entity
@Table(name = "fecha")
public class Fecha {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int idFecha;
    private int anio;
    private int mes;
    private int dia;
}