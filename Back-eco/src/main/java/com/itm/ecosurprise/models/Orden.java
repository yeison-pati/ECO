package com.itm.ecosurprise.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;



/*
 * @Data crea automaticamente getters y setters
 * @Entity indica que es una entidad de JPA
 * @Table indica el nombre de la tabla en la base de datos
 * @JsonIgnoreProperties se usa para evitar la recursividad infinita al obtener jsons
 * @CascadeType.ALL indica que se aplicaran todas las operaciones de persistencia a los objetos relacionados
 * @OneToMany indica que hay una relacion de uno a muchos entre las entidades
 * @ManyToOne indica que hay una relacion de muchos a uno entre las entidades
 * @JoinColumn indica la columna de la tabla que se usara para la relacion
 */
@Data
@Entity
@Table(name = "orden")
public class Orden {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int idOrden;

    @ManyToOne
    @JoinColumn(name = "idUsuario")
    @JsonIgnoreProperties(value = {
		"correo", "contrasena", "telefono", "rol", "nit", "rut", "productos", "sedes"
	  })
    private Consumidor consumidor;

    @ManyToOne
    @JoinColumn(name = "idFecha")
    private Fecha fechaOrden;

    private int montoTotal;

    @ManyToOne
    @JoinColumn(name = "idDireccion")
    private Direccion direccionEntrega;

    @OneToMany(mappedBy = "orden", cascade = CascadeType.ALL)
    @JsonIgnoreProperties(value = {
		"comerciante", "descripcion", "puntuaciones"
	  })
    private List<OrdenProducto> productos;

    private String estadoOrden = "pendiente";

    @OneToOne(mappedBy = "orden", cascade = CascadeType.ALL)
    @JsonIgnoreProperties(value = {
		"orden"
	  })
    @EqualsAndHashCode.Exclude
    private Pago pago;
}