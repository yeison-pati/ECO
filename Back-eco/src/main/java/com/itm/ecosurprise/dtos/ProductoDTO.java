package com.itm.ecosurprise.dtos;

import lombok.Data;

/**
 * @Data crea automaticamente getters y setters
 * entidad para traer datos selectos de los productos
 */
@Data
public class ProductoDTO {
    private int id;
    private String imagen;
    private String nombre;
    private int precio;
    private int cantidad;
}
