package com.itm.ecosurprise.dtos;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;

/*
 * @Data crea automaticamente getters y setters
 * entidad para almacenar los productos en el carrito de compras
 */
@Data
public class CarritoDTO {
    private List<ProductoDTO> productos = new ArrayList<>();
    private int total = 0;
}
