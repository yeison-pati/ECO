package com.itm.ecosurprise.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.itm.ecosurprise.models.Telefono;
import com.itm.ecosurprise.services.ComercianteService;
import com.itm.ecosurprise.services.OrdenService;
import com.itm.ecosurprise.services.PreparacionOrdenes;
import com.itm.ecosurprise.services.ProductoService;
import com.itm.ecosurprise.services.TelefonoService;
import com.itm.ecosurprise.services.UsuarioService;

/*
 * @RestController indica que esta clase es un controlador REST que maneja solicitudes HTTP.
 * @RequestMapping("/api/comerciantes") define la ruta base para todas las solicitudes de este controlador.
 * @PathVariable se usa para extraer valores de la URL.
 * @RequestBody se usa para extraer el cuerpo de la solicitud HTTP.
 * @RequestParam se usa para extraer parámetros de la solicitud HTTP.
 * @RequestPart se usa para extraer partes de una solicitud multipart/form-data.
 * mediatype.MULTIPART_FORM_DATA_VALUE indica que el controlador acepta solicitudes con datos de formulario multipart.
 */
@RestController
@RequestMapping("/api/comerciantes")
public class ComercianteController {

    /*
     * @Autowired inyecta las dependencias de los servicios ComercianteService y
     * OrdenService.
     * Esto permite utilizar los métodos de estos servicios en el controlador.
     */
    @Autowired
    private PreparacionOrdenes preparacionOrdenes;
    @Autowired
    private ComercianteService comercianteService;
    @Autowired
    private OrdenService ordenService;
    @Autowired
    private TelefonoService telefonoService;
    @Autowired
    private ProductoService productoService;
    @Autowired
    private UsuarioService usuarioService;

    @PostMapping(value = "/{idComerciante}/establecerImagen", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> setImagen(
            @PathVariable int idComerciante,
            @RequestParam("imagen") MultipartFile imagen,
            @RequestHeader("Authorization") String authorizationHeader) {
        // Extraer el token del header Authorization
        String token = authorizationHeader.replace("Bearer ", "");
        return usuarioService.setImagen(idComerciante, imagen, token);
    }

    @PostMapping("/{idComerciante}/crearTelefono")
    public ResponseEntity<?> crearTelefono(@PathVariable int idComerciante, @RequestBody Telefono telefono) {
        return telefonoService.crear(idComerciante, telefono);
    }

    @PostMapping(value = "/{idComerciante}/crearProducto", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> crearProducto(
            @PathVariable int idComerciante,
            @RequestParam("producto") String producto,  // <-- String, no Map
            @RequestParam("imagen") MultipartFile imagen) {
        return productoService.crear(idComerciante, producto, imagen);
    }

    @GetMapping("/{idComerciante}/productos/todos")
    public ResponseEntity<?> obtenerProductos(@PathVariable int idComerciante) {
        return comercianteService.obtenerProductos(idComerciante);
    }

    @GetMapping("/{idComerciante}/productos/{idProducto}")
    public ResponseEntity<?> obtenerProductoPorId(@PathVariable int idComerciante, @PathVariable int idProducto) {
        return comercianteService.obtenerProductoPorId(idComerciante, idProducto);
    }

    @PostMapping("/{idComerciante}/actualizarProducto/{idProducto}")
    public ResponseEntity<?> actualizarProducto(
            @PathVariable int idComerciante,
            @PathVariable int idProducto,
            @RequestParam("producto") String producto,  // <-- String, no Map
            @RequestParam("imagen") MultipartFile imagen) {
        return productoService.actualizar(idComerciante, idProducto, producto, imagen);
    }

    @GetMapping("/{idComerciante}/ordenes/todos")
    public ResponseEntity<?> obtenerOrdenes(@PathVariable int idComerciante) {
        return ordenService.obtenerTodosPorComerciante(idComerciante);
    }

    @GetMapping("/{idComerciante}/ordenes/{idOrden}")
    public ResponseEntity<?> obtenerOrden(@PathVariable int idComerciante, @PathVariable int idOrden) {

        return ordenService.productosPorIdAndComerciante(idComerciante, idOrden);
    }

    @PostMapping("/{idComerciante}/ordenes/{idOrden}/confirmar")
    public ResponseEntity<?> confirmarOrden(@PathVariable int idComerciante, @PathVariable int idOrden) {
        return preparacionOrdenes.agregarOrden(idComerciante, idOrden);
    }

    @GetMapping("/{idComerciante}/ordenes/preparacion")
    public ResponseEntity<?> orenesPreparacion(@PathVariable int idComerciante) {
        return preparacionOrdenes.obtenerOrdenes(idComerciante);
    }

    // obtener orden de la lista de ordenes en prep
    @GetMapping("/{idComerciante}/ordenes/preparacion/{idOrden}")
    public ResponseEntity<?> ordenPreparacion(@PathVariable int idComerciante, @PathVariable int idOrden) {
        return preparacionOrdenes.obtenerOrden(idComerciante, idOrden);
    }

    @PostMapping("/{id}/completarRegistro")
    public ResponseEntity<?> completarRegistro(
            @PathVariable int id,
            @RequestParam("nit") String nit,
            @RequestParam("camaraComercio") MultipartFile camaraComercio,
            @RequestParam("rut") MultipartFile rut) {
        return comercianteService.completarRegistro(id, nit, camaraComercio, rut);
    }
}
