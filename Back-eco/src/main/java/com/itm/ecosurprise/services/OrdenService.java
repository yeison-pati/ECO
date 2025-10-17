package com.itm.ecosurprise.services;

import java.util.*;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.itm.ecosurprise.classes.EstadoOrdenFactory;
import com.itm.ecosurprise.dtos.CarritoDTO;
import com.itm.ecosurprise.dtos.ProductoDTO;
import com.itm.ecosurprise.enums.EstadoOrden;
import com.itm.ecosurprise.interfaces.EstadoOrdenState;
import com.itm.ecosurprise.models.Consumidor;
import com.itm.ecosurprise.models.Direccion;
import com.itm.ecosurprise.models.Fecha;
import com.itm.ecosurprise.models.Orden;
import com.itm.ecosurprise.models.OrdenProducto;
import com.itm.ecosurprise.models.Pago;
import com.itm.ecosurprise.models.Producto;
import com.itm.ecosurprise.models.UsuarioDireccion;
import com.itm.ecosurprise.repositories.IComerciante;
import com.itm.ecosurprise.repositories.IConsumidor;
import com.itm.ecosurprise.repositories.IOrden;
import com.itm.ecosurprise.repositories.IProducto;

@Service
public class OrdenService {

    @Autowired
    private IOrden ordenRepository;
    @Autowired
    private IConsumidor consumidorRepository;
    @Autowired
    private IComerciante comercianteRepository;
    @Autowired
    private FechaService fechaService;
    @Autowired
    private CarritoService carritoService;
    @Autowired
    private PagoService pagoService;
    @Autowired
    private IProducto productoRepository;
    @Autowired
    private OrdenProductoService ordenProductoService;

    public ResponseEntity<?> obtenerPorId(int idComerciante, int idOrden) {
        try {
            if (!ordenRepository.existsById(idComerciante)) {
                throw new RuntimeException("Comerciante no encontrado");
            }
            return ResponseEntity.ok(obtenerXID(idOrden));
        } catch (Exception e) {

            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    public ResponseEntity<?> obtenerTodos(int idComerciante) {
        try {
            comercianteRepository.findById(idComerciante)
                    .orElseThrow(() -> new RuntimeException("Comerciante no encontrado"));
            return ResponseEntity.ok(ordenRepository.findAll());
        } catch (Exception e) {
            if (e.getMessage().contains("no encontrado")) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
            }

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    public Orden obtenerXID(int idOrden) {
        return ordenRepository.findById(idOrden)
                .orElseThrow(() -> new RuntimeException("Orden no encontrada con ID: " + idOrden));
    }

    public ResponseEntity<?> crear(int idConsumidor, Orden orden) {

        Orden ordenFinal = new Orden();

        try {

            CarritoDTO carrito = carritoService.obtenerCarrito(idConsumidor);

            if (carrito.getProductos().isEmpty()) {

                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("El carrito está vacío. No se pueden agregar productos a la orden.");
            }

            for (ProductoDTO productoDTO : carrito.getProductos()) {

                Producto producto = productoRepository.findById(productoDTO.getId())
                        .orElseThrow(
                                () -> new RuntimeException("Producto no encontrado con ID: " + productoDTO.getId()));

                if (producto.getStock() < productoDTO.getCantidad()) {

                    return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                            .body("No hay suficiente stock para el producto: " + producto.getNombre());
                }
            }

            Consumidor consumidor = consumidorRepository.findById(idConsumidor)
                    .orElseThrow(() -> new RuntimeException("Consumidor no encontrado con ID: " + idConsumidor));
            orden.setConsumidor(consumidor);

            Fecha fecha = fechaService.crear(orden.getFechaOrden());
            orden.setFechaOrden(fecha);

            int monto = carritoService.calcularTotal(idConsumidor);
            orden.setMontoTotal(monto);

            orden.setEstadoOrden(EstadoOrden.PENDIENTE.name());
            
            Direccion direccionEntrega = orden.getDireccionEntrega();

            if (direccionEntrega != null && direccionEntrega.getIdDireccion() > 0) {
                Direccion direccion = consumidor.getDirecciones().stream()
                        .map(UsuarioDireccion::getDireccion)
                        .filter(d -> d.getIdDireccion() == direccionEntrega.getIdDireccion())
                        .findFirst()
                        .orElseThrow(() -> new RuntimeException(
                                "Dirección no encontrada con ID: " + direccionEntrega.getIdDireccion()));
                orden.setDireccionEntrega(direccion);
            } else {
                // Si viene null (o sin id), no se asigna dirección
                orden.setDireccionEntrega(null);
            }

            Orden ordenExistente = ordenRepository.save(orden);
            ordenExistente = obtenerXID(ordenExistente.getIdOrden());

            Pago nuevoPago = new Pago();
            nuevoPago.setMetodoPago(orden.getPago().getMetodoPago());
            nuevoPago.setEstadoPago(orden.getPago().getEstadoPago());
            nuevoPago.setFechaPago(fecha);
            nuevoPago.setMontoPagado(monto);
            nuevoPago.setOrden(ordenExistente);

            ordenExistente.setPago(pagoService.crear(nuevoPago));

            ordenExistente = ordenRepository.save(ordenExistente);

            List<OrdenProducto> productos = new ArrayList<>();
            for (ProductoDTO productoDTO : carrito.getProductos()) {

                Producto producto = productoRepository.findById(productoDTO.getId())
                        .orElseThrow(() -> new RuntimeException(
                                "Producto no encontrado con ID: " + productoDTO.getId()));

                producto.setStock(producto.getStock() - productoDTO.getCantidad());
                productoRepository.save(producto);

                OrdenProducto ordenProducto = new OrdenProducto();
                ordenProducto.setOrden(ordenExistente);
                ordenProducto.setProducto(producto);
                productos.add(ordenProductoService.crear(ordenProducto));
            }
            ordenExistente.setProductos(productos);

            carritoService.limpiarCarrito(idConsumidor);

            ordenFinal = ordenRepository.save(ordenExistente);

            return ResponseEntity.status(HttpStatus.CREATED).body(ordenFinal);
        } catch (Exception e) {
            System.err.println("=== ERROR EN CREAR ORDEN ===");
            System.err.println("Tipo de error: " + e.getClass().getSimpleName());
            System.err.println("Mensaje: " + e.getMessage());
            System.err.println("Causa: " + (e.getCause() != null ? e.getCause().getMessage() : "Sin causa"));
            System.err.println("Stack trace:");

            e.printStackTrace();
            System.err.println("============================");

            Map<String, String> error = new HashMap<>();
            error.put("mensaje", e.getMessage());
            error.put("causa", e.getCause() != null ? e.getCause().getMessage() : "Desconocida");

            if (e.getMessage().contains("no encontrado")) {
                System.err.println("Retornando NOT_FOUND");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
            }

            System.err.println("Retornando INTERNAL_SERVER_ERROR");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        } finally {

            if (ordenFinal != null &&
                    ordenFinal.getIdOrden() > 0 &&
                    orden.getPago() != null &&
                    Objects.equals(orden.getPago().getEstadoPago(), "APROBADO")) {

                try {
                    Thread.sleep(1000);
                    confirmar(ordenFinal.getIdOrden());
                } catch (Exception e) {

                    System.err.println("Error al confirmar orden automáticamente: " + e.getMessage());
                }
            }
        }
    }

    public Orden actualizar(Orden idOrden) {
        return ordenRepository.save(idOrden);
    }

    public String eliminarOrden(int idOrden) {
        ordenRepository.deleteById(idOrden);
        return "Orden eliminada con exito";
    }

    public Orden confirmar(int idOrden) {
        Orden orden = ordenRepository.findById(idOrden)
                .orElseThrow(() -> new RuntimeException("Orden no encontrada"));

        EstadoOrdenState estadoActual = EstadoOrdenFactory.getEstado(orden);
        estadoActual.confirmar(orden);

        return ordenRepository.save(orden);
    }

    public ResponseEntity<?> cancelar(int idConsumidor, int idOrden) {
        try {
            Orden ordenExistente = ordenRepository.findById(idOrden)
                    .orElseThrow(() -> new RuntimeException("Orden no encontrada"));

            EstadoOrdenState estadoActual = EstadoOrdenFactory.getEstado(ordenExistente);
            estadoActual.cancelar(ordenExistente);
            ordenRepository.save(ordenExistente);

            return ResponseEntity.ok("Orden cancelada con exito");
        } catch (Exception e) {
            if (e.getMessage().contains("no encontrada")) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
            }

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    public ResponseEntity<?> obtenerTodosPorComerciante(int idComerciante) {
        try {
            comercianteRepository.findById(idComerciante)
                    .orElseThrow(() -> new RuntimeException("Comerciante no encontrado"));

            List<Orden> ordenes = ordenRepository.findAllByIdComerciante(idComerciante);

            return ResponseEntity.ok(ordenes);
        } catch (Exception e) {
            if (e.getMessage().contains("no encontrado")) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
            }

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    public ResponseEntity<?> productosPorIdAndComerciante(int idComerciante, int idOrden) {
        try {
            comercianteRepository.findById(idComerciante)
                    .orElseThrow(() -> new RuntimeException("Comerciante no encontrado"));

            Orden orden = ordenRepository.findByIdAndComerciante(idOrden, idComerciante);

            List<OrdenProducto> productosFiltrados = orden.getProductos().stream()
                    .filter(o -> o.getProducto().getComerciante().getIdUsuario() == idComerciante)
                    .collect(Collectors.toList());

            if (productosFiltrados.isEmpty()) {

                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Orden no encontrada o no tiene productos del comerciante");
            }

            return ResponseEntity.ok(productosFiltrados);
        } catch (Exception e) {
            if (e.getMessage() != null && (e.getMessage().contains("no encontrado") ||
                    e.getMessage().contains("no encontrada"))) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
            }

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }
}