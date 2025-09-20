package com.itm.ecosurprise.models;

import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
/*
 * @EqualsAndHashCode(callSuper = true) permite usar el constructor de la clase padre
 * @Data crea automaticamente getters y setters
 * @Entity indica que es una entidad de JPA
 * @Table indica el nombre de la tabla en la base de datos
 * @JsonIgnoreProperties se usa para evitar la recursividad infinita al obtener jsons
 * @CascadeType.ALL indica que se aplicaran todas las operaciones de persistencia a los objetos relacionados
 * @OneToMany indica que hay una relacion de uno a muchos entre las entidades
 * @JsonIgnore se usa para evitar traer esos datos en el objeto json
 * @OneToOne indica que hay una relacion de uno a uno entre las entidades
 */
@Data
@Entity
@Table(name = "entregas")
public class Entrega {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int idEntrega;

	@OneToOne
	@JsonIgnoreProperties(value = {
		"direccionEntrega","pago"
	  })
	private Orden orden;

	@OneToOne
	private Repartidor repartidor;

	private int numeroEntrega;

	@OneToMany(mappedBy = "entrega", cascade = CascadeType.ALL)
	private List<EntregaDireccion> direcciones;

	private String estadoEntrega;

}
