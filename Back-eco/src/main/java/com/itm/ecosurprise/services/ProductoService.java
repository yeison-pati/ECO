package com.itm.ecosurprise.services;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Map;
import java.util.UUID;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.itm.ecosurprise.models.Comerciante;
import com.itm.ecosurprise.models.Producto;
import com.itm.ecosurprise.repositories.IComerciante;
import com.itm.ecosurprise.repositories.IConsumidor;
import com.itm.ecosurprise.repositories.IProducto;

@Service
public class ProductoService {

    @Autowired
    private IProducto productoRepository;
    @Autowired
    private IComerciante comercianteRepository;
    @Autowired
    private IConsumidor consumidorRepository;
    @Autowired
    private HttpServletRequest request;

    /**
     * Obtiene todos los productos disponibles para un consumidor específico.
     *
     * @param idConsumidor El ID del consumidor.
     * @return ResponseEntity con la lista de productos si se encuentra el
     *         consumidor,
     *         o un mensaje de error si no se encuentra.
     */
    public ResponseEntity<?> obtenerTodos(int idConsumidor) {
        try {
            consumidorRepository.findById(idConsumidor)
                    .orElseThrow(() -> new RuntimeException("Consumidor no encontrado"));
            return ResponseEntity.ok(productoRepository.findAll());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    /**
     * Obtiene un producto específico para un consumidor basado en el ID de la
     * orden.
     *
     * @param idConsumidor El ID del consumidor.
     * @param idProducto   El ID del producto a buscar.
     * @return ResponseEntity con el producto si se encuentra,
     *         o un mensaje de error si no se encuentra.
     */
    public ResponseEntity<?> obtenerXID(int idConsumidor, int idProducto) {
        try {
            consumidorRepository.findById(idConsumidor)
                    .orElseThrow(() -> new RuntimeException("Consumidor no encontrado"));
            return ResponseEntity.ok(productoRepository.findById(idProducto)
                    .orElseThrow(() -> new RuntimeException("Producto no encontrado, intente de nuevo")));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    /**
     * Crea un nuevo producto y guarda la imagen asociada en el servidor.
     *
     * @param idComerciante El ID del comerciante que está creando el producto.
     * @param producto      El objeto Producto a crear.
     * @param imagen        El archivo de imagen del producto.
     * @return El producto creado con la URL de la imagen asociada.
     * @throws IOException Si ocurre un error al guardar la imagen en el servidor.
     */
    public ResponseEntity<?> crear(int idComerciante, String producto, MultipartFile imagen) {

        try {
            Map<String, Object> productoMap;
            // Parsear JSON string a Map manualmente
            ObjectMapper objectMapper = new ObjectMapper();
            try {
                productoMap = objectMapper.readValue(producto, Map.class);

            } catch (JsonProcessingException e) {
                return ResponseEntity.badRequest().body("Error parsing JSON: " + e.getMessage());
            }
            Producto productoAux = new Producto();

            Comerciante comerciante = comercianteRepository.findById(idComerciante)
                    .orElseThrow(() -> new RuntimeException("Comerciante no encontrado"));

            if (imagen != null && !imagen.isEmpty()) {
                // Generar nombre único para la imagen
                String nombreArchivo = UUID.randomUUID().toString() + "_" + imagen.getOriginalFilename();

                // Ruta local donde se guardará
                String carpeta = "src/main/resources/static/productos/";
                File directorio = new File(carpeta);
                if (!directorio.exists())
                    directorio.mkdirs();

                // Guardar archivo en disco
                Path ruta = Paths.get(carpeta + nombreArchivo);
                Files.copy(imagen.getInputStream(), ruta, StandardCopyOption.REPLACE_EXISTING);

                // Construir URL pública de acceso
                // HTTP://localhost:8080
                String urlBase = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort();
                String urlImagen = urlBase + "/productos/" + nombreArchivo;

                // Guardar solo la ruta o URL
                productoAux.setImagen(urlImagen);
            } else {
                throw new RuntimeException("Imagen vacía");
            }

            productoAux.setComerciante(comerciante);
            productoAux.setNombre((String) productoMap.get("nombre"));
            productoAux.setDescripcion((String) productoMap.get("descripcion"));
            productoAux.setTipo((String) productoMap.get("tipo"));

            Object precioObj = productoMap.get("precio");
            Object stockObj = productoMap.get("stock");

// Manejar tanto Integer como String
            int precio = precioObj instanceof Integer ?
                    (Integer) precioObj :
                    Integer.parseInt(precioObj.toString());

            int stock = stockObj instanceof Integer ?
                    (Integer) stockObj :
                    Integer.parseInt(stockObj.toString());

            productoAux.setPrecio(precio);
            productoAux.setStock(stock);

            return ResponseEntity.ok(productoRepository.save(productoAux));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    /**
     * Actualiza la información de un producto existente.
     *
     * @param producto El producto con la nueva información.
     * @return El producto actualizado.
     */
    public ResponseEntity<?> actualizar(int idComerciante, int idProducto, String producto, MultipartFile imagen) {


        try {

            Producto productoExistente = productoRepository.findById(idProducto)
                    .orElseThrow(() -> new RuntimeException("Producto no encontrado, intente de nuevo"));

            Comerciante comerciante = comercianteRepository.findById(idComerciante)
                    .orElseThrow(() -> new RuntimeException("Comerciante no encontrado"));

            Map<String, Object> productoMap;
            // Parsear JSON string a Map manualmente
            ObjectMapper objectMapper = new ObjectMapper();
            try {
                productoMap = objectMapper.readValue(producto, Map.class);

            } catch (JsonProcessingException e) {
                return ResponseEntity.badRequest().body("Error parsing JSON: " + e.getMessage());
            }
            Producto productoAux = new Producto();

            if (imagen != null && !imagen.isEmpty()) {
                // Generar nombre único para la imagen
                String nombreArchivo = UUID.randomUUID().toString() + "_" + imagen.getOriginalFilename();

                // Ruta local donde se guardará
                String carpeta = "src/main/resources/static/productos/";
                File directorio = new File(carpeta);
                if (!directorio.exists())
                    directorio.mkdirs();

                // Guardar archivo en disco
                Path ruta = Paths.get(carpeta + nombreArchivo);
                Files.copy(imagen.getInputStream(), ruta, StandardCopyOption.REPLACE_EXISTING);

                // Construir URL pública de acceso
                // HTTP://localhost:8080
                String urlBase = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort();
                String urlImagen = urlBase + "/productos/" + nombreArchivo;

                // Guardar solo la ruta o URL
                productoAux.setImagen(urlImagen);
            } else {
                throw new RuntimeException("Imagen vacía");
            }

            productoAux.setComerciante(comerciante);
            productoAux.setNombre((String) productoMap.get("nombre"));
            productoAux.setDescripcion((String) productoMap.get("descripcion"));
            productoAux.setTipo((String) productoMap.get("tipo"));

            Object precioObj = productoMap.get("precio");
            Object stockObj = productoMap.get("stock");

// Manejar tanto Integer como String
            int precio = precioObj instanceof Integer ?
                    (Integer) precioObj :
                    Integer.parseInt(precioObj.toString());

            int stock = stockObj instanceof Integer ?
                    (Integer) stockObj :
                    Integer.parseInt(stockObj.toString());

            productoAux.setPrecio(precio);
            productoAux.setStock(stock);

            return ResponseEntity.ok(productoRepository.save(productoAux));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    /**
     * Elimina un producto dado su ID.
     *
     * @param id El ID del producto a eliminar.
     * @return Un mensaje indicando que el producto fue eliminado con éxito.
     */
    public String eliminar(int id) {
        productoRepository.deleteById(id);
        return "Producto eliminado con éxito";
    }
}
