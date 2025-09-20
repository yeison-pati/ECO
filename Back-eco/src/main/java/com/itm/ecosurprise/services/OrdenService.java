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
            // NOT_FOUND es correcto para recursos no encontrados
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
            // INTERNAL_SERVER_ERROR para otros errores
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    public Orden obtenerXID(int idOrden) {
        return ordenRepository.findById(idOrden)
                .orElseThrow(() -> new RuntimeException("Orden no encontrada con ID: " + idOrden));
    }

    public ResponseEntity<?> crear(int idConsumidor, Orden orden) {

        Orden ordenFinal = new Orden();

        System.out.println("=== ORDEN SERVICE - CREAR INICIO ===");
        System.out.println("idConsumidor recibido: " + idConsumidor);
        System.out.println("orden recibida: " + orden);

        if (orden != null) {
            System.out.println("orden.getFechaOrden(): " + orden.getFechaOrden());
            System.out.println("orden.getDireccionEntrega(): " + orden.getDireccionEntrega());
            System.out.println("orden.getPago(): " + orden.getPago());

            if (orden.getDireccionEntrega() != null) {
                System.out.println("direccionEntrega.idDireccion: " + orden.getDireccionEntrega().getIdDireccion());
            } else {
                System.out.println("direccionEntrega es NULL");
            }

            if (orden.getPago() != null) {
                System.out.println("pago.metodoPago: " + orden.getPago().getMetodoPago());
                System.out.println("pago.estadoPago: " + orden.getPago().getEstadoPago());
            } else {
                System.out.println("pago es NULL");
            }
        } else {
            System.out.println("ORDEN ES NULL - ERROR CRÍTICO");
        }
        System.out.println("=====================================");

        try {
            System.out.println("1. Obteniendo carrito del consumidor...");
            // Obtener carrito del consumidor
            CarritoDTO carrito = carritoService.obtenerCarrito(idConsumidor);
            System.out.println("Carrito obtenido - productos: " + carrito.getProductos().size());
            System.out.println("Carrito total: " + carrito.getTotal());

            if (carrito.getProductos().isEmpty()) {
                System.out.println("ERROR: Carrito vacío - retornando BAD_REQUEST");
                // BAD_REQUEST es correcto para datos de entrada inválidos
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("El carrito está vacío. No se pueden agregar productos a la orden.");
            }

            System.out.println("2. Validando stock de productos...");
            // Validar stock de los productos
            for (ProductoDTO productoDTO : carrito.getProductos()) {
                System.out.println("Validando producto ID: " + productoDTO.getId() + ", cantidad: " + productoDTO.getCantidad());

                Producto producto = productoRepository.findById(productoDTO.getId())
                        .orElseThrow(
                                () -> new RuntimeException("Producto no encontrado con ID: " + productoDTO.getId()));

                System.out.println("Producto encontrado - stock disponible: " + producto.getStock());

                if (producto.getStock() < productoDTO.getCantidad()) {
                    System.out.println("ERROR: Stock insuficiente para producto: " + producto.getNombre());
                    // BAD_REQUEST es correcto para datos de entrada inválidos
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                            .body("No hay suficiente stock para el producto: " + producto.getNombre());
                }
                System.out.println("Stock OK para producto: " + producto.getNombre());
            }

            System.out.println("3. Obteniendo consumidor...");
            // Obtener el consumidor
            Consumidor consumidor = consumidorRepository.findById(idConsumidor)
                    .orElseThrow(() -> new RuntimeException("Consumidor no encontrado con ID: " + idConsumidor));
            System.out.println("Consumidor encontrado: " + consumidor.getNombre());
            orden.setConsumidor(consumidor);

            System.out.println("4. Creando fecha de la orden...");
            // Crear y asignar fecha de la orden
            Fecha fecha = fechaService.crear(orden.getFechaOrden());
            System.out.println("Fecha creada: " + fecha);
            orden.setFechaOrden(fecha);

            System.out.println("5. Calculando monto total...");
            // Calcular monto total
            int monto = carritoService.calcularTotal(idConsumidor);
            System.out.println("Monto total calculado: " + monto);
            orden.setMontoTotal(monto);

            System.out.println("6. Asignando estado inicial...");
            // Asignar estado inicial a la orden
            orden.setEstadoOrden(EstadoOrden.PENDIENTE.name());
            System.out.println("Estado asignado: " + EstadoOrden.PENDIENTE.name());

            System.out.println("7. Procesando dirección de entrega...");
            // Asignar dirección de entrega
            System.out.println("orden.getDireccionEntrega() antes del null check: " + orden.getDireccionEntrega());

            Integer idDireccion = orden.getDireccionEntrega().getIdDireccion();
            System.out.println("idDireccion extraído: " + idDireccion);

            if(idDireccion != null && idDireccion > 0) {
                System.out.println("Buscando dirección con ID: " + idDireccion);
                Direccion direccion = consumidor.getDirecciones().stream()
                        .map(UsuarioDireccion::getDireccion)
                        .filter(d -> d.getIdDireccion() == orden.getDireccionEntrega().getIdDireccion())
                        .findFirst()
                        .orElseThrow(() -> new RuntimeException(
                                "Dirección no encontrada con ID: " + orden.getDireccionEntrega().getIdDireccion()));
                orden.setDireccionEntrega(direccion);
                System.out.println("Dirección asignada: " + direccion);
            } else {
                System.out.println("ID dirección es null o <= 0, asignando null a direccionEntrega");
                orden.setDireccionEntrega(null);
            }

            System.out.println("8. Guardando orden inicial...");
            // Guardar la orden y crear el pago
            Orden ordenExistente = ordenRepository.save(orden);
            System.out.println("Orden guardada con ID: " + ordenExistente.getIdOrden());

            ordenExistente = obtenerXID(ordenExistente.getIdOrden());
            System.out.println("Orden reobtenida por ID");

            System.out.println("9. Creando pago...");
            Pago nuevoPago = new Pago();
            nuevoPago.setMetodoPago(orden.getPago().getMetodoPago());
            nuevoPago.setEstadoPago(orden.getPago().getEstadoPago());
            nuevoPago.setFechaPago(fecha);
            nuevoPago.setMontoPagado(monto);
            nuevoPago.setOrden(ordenExistente);
            System.out.println("Pago creado - método: " + nuevoPago.getMetodoPago() + ", estado: " + nuevoPago.getEstadoPago());

            ordenExistente.setPago(pagoService.crear(nuevoPago));
            System.out.println("Pago asignado a la orden");

            System.out.println("10. Guardando orden con pago...");
            // Guardar la orden con el pago asignado
            ordenExistente = ordenRepository.save(ordenExistente);
            System.out.println("Orden guardada con pago");

            System.out.println("11. Asociando productos con la orden...");
            // Asociar los productos con la orden y actualizar stock
            List<OrdenProducto> productos = new ArrayList<>();
            for (ProductoDTO productoDTO : carrito.getProductos()) {
                System.out.println("Procesando producto ID: " + productoDTO.getId());

                Producto producto = productoRepository.findById(productoDTO.getId())
                        .orElseThrow(() -> new RuntimeException(
                                "Producto no encontrado con ID: " + productoDTO.getId()));

                System.out.println("Stock actual: " + producto.getStock() + ", cantidad a descontar: " + productoDTO.getCantidad());

                // Actualizar stock
                producto.setStock(producto.getStock() - productoDTO.getCantidad());
                productoRepository.save(producto);
                System.out.println("Stock actualizado a: " + producto.getStock());

                // Crear asociación orden-producto
                OrdenProducto ordenProducto = new OrdenProducto();
                ordenProducto.setOrden(ordenExistente);
                ordenProducto.setProducto(producto);
                productos.add(ordenProductoService.crear(ordenProducto));
                System.out.println("Asociación orden-producto creada");
            }
            ordenExistente.setProductos(productos);
            System.out.println("Todos los productos asociados a la orden");

            System.out.println("12. Vaciando carrito...");
            // Vaciar carrito después de procesar la orden
            carritoService.limpiarCarrito(idConsumidor);
            System.out.println("Carrito vaciado");

            System.out.println("13. Guardando orden final...");
            ordenFinal = ordenRepository.save(ordenExistente);
            System.out.println("Orden final guardada con ID: " + ordenFinal.getIdOrden());

            System.out.println("=== ORDEN CREADA EXITOSAMENTE ===");
            System.out.println("ID de orden: " + ordenFinal.getIdOrden());
            System.out.println("Estado: " + ordenFinal.getEstadoOrden());
            System.out.println("Monto: " + ordenFinal.getMontoTotal());
            System.out.println("================================");

            // CREATED es más apropiado para recursos creados
            return ResponseEntity.status(HttpStatus.CREATED).body(ordenFinal);
        } catch (Exception e) {
            System.err.println("=== ERROR EN CREAR ORDEN ===");
            System.err.println("Tipo de error: " + e.getClass().getSimpleName());
            System.err.println("Mensaje: " + e.getMessage());
            System.err.println("Causa: " + (e.getCause() != null ? e.getCause().getMessage() : "Sin causa"));
            System.err.println("Stack trace:");
            // Loguear el error para diagnóstico
            e.printStackTrace();
            System.err.println("============================");

            // Devolver respuesta de error con mensaje específico
            Map<String, String> error = new HashMap<>();
            error.put("mensaje", e.getMessage());
            error.put("causa", e.getCause() != null ? e.getCause().getMessage() : "Desconocida");

            // Diferenciar entre tipos de errores
            if (e.getMessage().contains("no encontrado")) {
                System.err.println("Retornando NOT_FOUND");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
            }

            System.err.println("Retornando INTERNAL_SERVER_ERROR");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        } finally {
            // ✅ Verificar que la orden se creó correctamente Y que tiene un ID válido
            if (ordenFinal != null &&
                    ordenFinal.getIdOrden() > 0 &&
                    orden.getPago() != null &&
                    Objects.equals(orden.getPago().getEstadoPago(), "APROBADO")) {

                try {
                    Thread.sleep(1000);
                    confirmar(ordenFinal.getIdOrden());
                } catch (Exception e) {
                    // Log del error pero no lanzar excepción
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
        estadoActual.confirmar(orden); // Delegar la lógica de confirmación al estado actual

        return ordenRepository.save(orden); // Guardar el cambio de estado
    }

    public ResponseEntity<?> cancelar(int idConsumidor, int idOrden) {
        try {
            Orden ordenExistente = ordenRepository.findById(idOrden)
                    .orElseThrow(() -> new RuntimeException("Orden no encontrada"));

            EstadoOrdenState estadoActual = EstadoOrdenFactory.getEstado(ordenExistente);
            estadoActual.cancelar(ordenExistente); // Delegar la lógica de confirmación al estado actual
            ordenRepository.save(ordenExistente); // Guardar el cambio de estado

            // OK es correcto para operaciones exitosas con información
            return ResponseEntity.ok("Orden cancelada con exito");
        } catch (Exception e) {
            if (e.getMessage().contains("no encontrada")) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
            }
            // INTERNAL_SERVER_ERROR para otros errores
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    public ResponseEntity<?> obtenerTodosPorComerciante(int idComerciante) {
        try {
            comercianteRepository.findById(idComerciante)
                    .orElseThrow(() -> new RuntimeException("Comerciante no encontrado"));

            List<Orden> ordenes = ordenRepository.findAllByIdComerciante(idComerciante);

            // Para listas vacías, es mejor retornar 200 con lista vacía en lugar de 404
            return ResponseEntity.ok(ordenes);
        } catch (Exception e) {
            if (e.getMessage().contains("no encontrado")) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
            }
            // INTERNAL_SERVER_ERROR para otros errores
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
                // NOT_FOUND es apropiado cuando no se encuentran recursos específicos
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Orden no encontrada o no tiene productos del comerciante");
            }

            return ResponseEntity.ok(productosFiltrados);
        } catch (Exception e) {
            if (e.getMessage() != null && (e.getMessage().contains("no encontrado") ||
                    e.getMessage().contains("no encontrada"))) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
            }
            // INTERNAL_SERVER_ERROR para otros errores
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }
}