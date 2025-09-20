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
 * @OneToMany indica que hay una relacion de uno a muchos entre las entidades
 * @ManyToOne indica que hay una relacion de muchos a uno entre las entidades
 * @OneToOne indica que hay una relacion de uno a uno entre las entidades
 * @JoinColumn indica la columna de la tabla que se usara para la relacion
 */
@Data
@Entity
@Table(name = "usuarioDireccion")
public class UsuarioDireccion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idUsuarioDireccion")
    private int idUsuarioDireccion;

    @ManyToOne
    @JoinColumn(name = "idUsuario")
    @JsonIgnoreProperties(value = {
		"correo", "contrasena", "telefono", "rol", "nit", "rut",
    "productos", "sedes", "direcciones", "puntos", "ordenes", "imagen", "tipo"
	  })
    private Usuario usuario;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "idDireccion")
    private Direccion direccion;
}
 