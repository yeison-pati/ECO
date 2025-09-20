package com.itm.ecosurprise.models;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;


/*
 * @EqualsAndHashCode(callSuper = true) permite usar el constructor de la clase padre
 * @Data crea automaticamente getters y setters
 * @Entity indica que es una entidad de JPA
 * @Table indica el nombre de la tabla en la base de datos
 * @JsonIgnoreProperties se usa para evitar la recursividad infinita al obtener jsons
 * @CascadeType.ALL indica que se aplicaran todas las operaciones de persistencia a los objetos relacionados
 * @OneToMany indica que hay una relacion de uno a muchos entre las entidades
 * @JsonIgnore se usa para evitar traer esos datos en el objeto json
 */

@Data
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "consumidores")
public class Consumidor extends Usuario {

    private int puntos;

    @OneToMany(mappedBy = "usuario", cascade = CascadeType.ALL)
    @JsonIgnoreProperties(value ={
        "idUsuarioDireccion","usuario"
    })
    private List<UsuarioDireccion> direcciones = new ArrayList<>();

    @OneToMany(mappedBy = "consumidor", cascade = CascadeType.ALL)
    @JsonIgnore
    @EqualsAndHashCode.Exclude
    private List<Orden> ordenes = new ArrayList<>();
}
