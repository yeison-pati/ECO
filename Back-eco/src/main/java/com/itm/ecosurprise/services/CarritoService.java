package com.itm.ecosurprise.services;

import com.itm.ecosurprise.dtos.CarritoDTO;
import com.itm.ecosurprise.dtos.ProductoDTO;
import com.itm.ecosurprise.models.Producto;
import com.itm.ecosurprise.repositories.IConsumidor;
import com.itm.ecosurprise.repositories.IProducto;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.NumberUtils;

import java.util.*;

/**
 * Servicio encargado de gestionar la lógica del carrito de compras.
 * 
 * @Service indica que esta clase es un componente de servicio administrado por Spring.
 */
@Service
public class CarritoService {
    @Autowired
    private IProducto productoRepository;
    @Autowired
    private IConsumidor consumidorRepository;

    /**
     * Mapa que almacena los carritos de cada consumidor en memoria.
     * 
     * Clave: ID del consumidor.
     * Valor: Instancia de {@link CarritoDTO}.
     * 
     * Nota: Los datos se pierden si el servidor se reinicia.
     */
    private final Map<Integer, CarritoDTO> carritos = new HashMap<>();

    /**
     * Obtiene el carrito asociado a un consumidor. Si no existe, lo crea.
     *
     * @param idConsumidor ID del consumidor.
     * @return Carrito asociado al consumidor.
     */
    public CarritoDTO obtenerCarrito(int idConsumidor) {
        consumidorRepository.findById(idConsumidor)
                .orElseThrow(() -> new RuntimeException(
                        "Consumidor no encontrado con ID: " + idConsumidor));
        return carritos.computeIfAbsent(idConsumidor, id -> new CarritoDTO());
    }

    /**
     * Agrega un producto al carrito de un consumidor.
     *
     * @param idConsumidor ID del consumidor.
     * @param idProducto ID del producto.
     * @param productoCantidad Cantidad del producto.
     * @return Respuesta HTTP indicando éxito o error.
     */
    public ResponseEntity<?> agregarProducto(int idConsumidor, int idProducto, int productoCantidad) {
        try {
            if (productoCantidad <= 0 || productoCantidad != NumberUtils.parseNumber(String.valueOf(productoCantidad), Integer.class)) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Cantidad no válida");
            }

            consumidorRepository.findById(idConsumidor)
                    .orElseThrow(() -> new RuntimeException(
                            "Consumidor no encontrado con ID: " + idConsumidor));

            CarritoDTO carrito = obtenerCarrito(idConsumidor);

            Producto productoExistente = productoRepository.findById(idProducto)
                    .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

            Optional<ProductoDTO> productoEnCarrito = carrito.getProductos().stream()
                    .filter(producto -> producto.getId() == productoExistente.getIdProducto())
                    .findFirst();

            if (productoEnCarrito.isPresent()) {
                productoEnCarrito.get().setCantidad(
                        productoEnCarrito.get().getCantidad() + productoCantidad
                );
                return ResponseEntity.ok("Cantidad actualizada en el carrito con éxito");
            }

            ProductoDTO nuevoProducto = new ProductoDTO();
            nuevoProducto.setId(productoExistente.getIdProducto());
            nuevoProducto.setImagen(productoExistente.getImagen());
            nuevoProducto.setNombre(productoExistente.getNombre());
            nuevoProducto.setPrecio(productoExistente.getPrecio());
            nuevoProducto.setCantidad(productoCantidad);

            carrito.getProductos().add(nuevoProducto);

            return ResponseEntity.ok("Producto agregado al carrito con éxito");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    /**
     * Elimina un producto del carrito de un consumidor.
     *
     * @param idConsumidor ID del consumidor.
     * @param idProducto ID del producto a eliminar.
     * @return Respuesta HTTP indicando éxito o error.
     */
    public ResponseEntity<?> eliminarProducto(int idConsumidor, int idProducto) {
        try {
            consumidorRepository.findById(idConsumidor)
                    .orElseThrow(() -> new RuntimeException(
                            "Consumidor no encontrado con ID: " + idConsumidor));
            CarritoDTO carrito = obtenerCarrito(idConsumidor);

            ProductoDTO productoAEliminar = carrito.getProductos().stream()
                    .filter(producto -> producto.getId() == idProducto)
                    .findFirst()
                    .orElseThrow(() -> new RuntimeException("Producto no encontrado en el carrito"));

            carrito.getProductos().remove(productoAEliminar);
            carrito.setTotal(calcularTotal(idConsumidor));

            return ResponseEntity.ok(carrito);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    /**
     * Cambia la cantidad de un producto existente en el carrito de un consumidor.
     *
     * @param idConsumidor ID del consumidor.
     * @param idProducto ID del producto.
     * @param cantidad Nueva cantidad a asignar.
     * @return Respuesta HTTP indicando éxito o error.
     */
    public ResponseEntity<?> cambiarCantidadProducto(int idConsumidor, int idProducto, int cantidad) {
        try {
            if (cantidad <= 0 || cantidad != NumberUtils.parseNumber(String.valueOf(cantidad), Integer.class)) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Cantidad no válida");
            }

            consumidorRepository.findById(idConsumidor)
                    .orElseThrow(() -> new RuntimeException(
                            "Consumidor no encontrado con ID: " + idConsumidor));
            CarritoDTO carrito = obtenerCarrito(idConsumidor);

            ProductoDTO productoAActualizar = carrito.getProductos().stream()
                    .filter(producto -> producto.getId() == idProducto)
                    .findFirst()
                    .orElseThrow(() -> new RuntimeException("Producto no encontrado en el carrito"));

            productoAActualizar.setCantidad(cantidad);
            carrito.setTotal(calcularTotal(idConsumidor));

            return ResponseEntity.ok(carrito);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    /**
     * Elimina todos los productos del carrito de un consumidor.
     *
     * @param idConsumidor ID del consumidor.
     * @return Respuesta HTTP indicando éxito o error.
     */
    public ResponseEntity<?> limpiarCarrito(int idConsumidor) {
        try {
            consumidorRepository.findById(idConsumidor)
                    .orElseThrow(() -> new RuntimeException(
                            "Consumidor no encontrado con ID: " + idConsumidor));
            carritos.remove(idConsumidor);
            return ResponseEntity.ok("Carrito limpiado con éxito");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    /**
     * Obtiene todos los productos en el carrito de un consumidor junto con el total calculado.
     *
     * @param idConsumidor ID del consumidor.
     * @return Carrito con productos y total.
     */
    public ResponseEntity<?> obtenerProductos(int idConsumidor) {
        try {
            calcularTotal(idConsumidor);
            CarritoDTO carrito = obtenerCarrito(idConsumidor);
            carrito.setTotal(calcularTotal(idConsumidor));
            return ResponseEntity.ok(carrito);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    /**
     * Calcula el total a pagar en el carrito de un consumidor.
     *
     * @param idConsumidor ID del consumidor.
     * @return Suma total del precio de los productos en el carrito.
     */
    public int calcularTotal(int idConsumidor) {
        consumidorRepository.findById(idConsumidor)
                .orElseThrow(() -> new RuntimeException(
                        "Consumidor no encontrado con ID: " + idConsumidor));

        CarritoDTO carrito = obtenerCarrito(idConsumidor);
        return carrito.getProductos().stream()
                .mapToInt(producto -> producto.getPrecio() * producto.getCantidad())
                .sum();
    }
}
