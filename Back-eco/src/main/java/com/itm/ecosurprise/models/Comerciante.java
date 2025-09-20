package com.itm.ecosurprise.models;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Table;

/*
 * @EqualsAndHashCode(callSuper = true) permite usar el constructor de la clase padre
 * @Data crea automaticamente getters y setters
 * @Entity indica que es una entidad de JPA
 * @Table indica el nombre de la tabla en la base de datos
 * @JsonIgnoreProperties se usa para evitar la recursividad infinita al obtener jsons
 * @CascadeType.ALL indica que se aplicaran todas las operaciones de persistencia a los objetos relacionados
 * @OneToMany indica que hay una relacion de uno a muchos entre las entidades
 */
@Data
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "comerciantes")
public class Comerciante extends Usuario {

	private String nit;
	private String rut;
	private String camaraComercio;
	
	@OneToMany(mappedBy = "comerciante", cascade = CascadeType.ALL)
	@JsonIgnoreProperties(value = {
		"comerciante", "puntuaciones"
	  })
	private List<Producto> productos;

	@OneToOne(cascade = CascadeType.ALL)
	@JoinColumn(name = "idDireccion")
	private Direccion direccion;
}
