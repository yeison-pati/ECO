package com.itm.ecosurprise.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

/*
 * @Inheritance indica que es una clase padre y se usara herencia
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
 @Inheritance(strategy = InheritanceType.JOINED)
 @Table(name = "usuarios")
 public abstract class Usuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int idUsuario;
    private String imagen;
    private String nombre;
    
    @Column(unique = true, nullable = false)
    private String correo;
    
    @Column(nullable = false)
    private String contrasena;

    @OneToOne(mappedBy = "usuario", cascade = CascadeType.ALL)
    @EqualsAndHashCode.Exclude
    private Telefono telefono;

    @Column(nullable = false)
    private String rol;
 
 }
