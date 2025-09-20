package com.itm.ecosurprise.services;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import jakarta.servlet.http.HttpServletRequest;

import com.itm.ecosurprise.models.Comerciante;
import com.itm.ecosurprise.models.Producto;
import com.itm.ecosurprise.repositories.IComerciante;

@Service
public class ComercianteService {

    @Autowired
    private IComerciante comercianteRepository;
    @Autowired
    private HttpServletRequest request;

    public ResponseEntity<?> obtenerTodos() {
        try {
            return ResponseEntity.ok(comercianteRepository.findAll());
        } catch (Exception e) {
            // INTERNAL_SERVER_ERROR en lugar de NOT_FOUND para errores de servidor
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    public ResponseEntity<?> obtenerPorId(int id) {
        try {
            return ResponseEntity.ok(comercianteRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Comerciante no encontrado con ID: " + id)));
        } catch (Exception e) {
            // NOT_FOUND es apropiado para recursos no encontrados
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    public ResponseEntity<?> eliminar(int id) {
        try {
            if (!comercianteRepository.existsById(id)) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Comerciante no encontrado con ID: " + id);
            }
            comercianteRepository.deleteById(id);
            // NO_CONTENT es más apropiado para eliminaciones exitosas
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        } catch (Exception e) {
            // INTERNAL_SERVER_ERROR para errores del servidor
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    public ResponseEntity<?> actualizar(int id, Comerciante comerciante) {
        try {
            Comerciante comercianteExistente = comercianteRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Comerciante no encontrado"));
            comercianteExistente.setNombre(comerciante.getNombre());
            return ResponseEntity.ok(comercianteRepository.save(comercianteExistente));
        } catch (Exception e) {
            if (e.getMessage().contains("no encontrado")) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
            }
            // INTERNAL_SERVER_ERROR para otros errores
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    public ResponseEntity<?> obtenerProductos(int idComerciante) {
        try {
            Comerciante comerciante = comercianteRepository.findById(idComerciante)
                    .orElseThrow(() -> new RuntimeException("Comerciante no encontrado"));
            List<Producto> productos = comerciante.getProductos();
            return ResponseEntity.ok(productos);
        } catch (Exception e) {
            if (e.getMessage().contains("no encontrado")) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
            }
            // INTERNAL_SERVER_ERROR para otros errores
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    public ResponseEntity<?> obtenerProductoPorId(int idComerciante, int idProducto) {
        try {
            Comerciante comerciante = comercianteRepository.findById(idComerciante)
                    .orElseThrow(() -> new RuntimeException("Comerciante no encontrado"));
            Producto producto = comerciante.getProductos().stream()
                    .filter(p -> p.getIdProducto() == idProducto)
                    .findFirst()
                    .orElseThrow(() -> new RuntimeException("Error al cargar el producto"));
            return ResponseEntity.ok(producto);
        } catch (Exception e) {
            if (e.getMessage().contains("no encontrado")) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
            }
            // INTERNAL_SERVER_ERROR para otros errores
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    public ResponseEntity<?> completarRegistro(int id, String nit, MultipartFile camaraComercio, MultipartFile rut) {
        Optional<Comerciante> comercianteOpt = comercianteRepository.findById(id);
        if (comercianteOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Comerciante no encontrado");
        }
        Comerciante comerciante = comercianteOpt.get();
        comerciante.setNit(nit);
        // Lógica para guardar los PDFs y setear las fileas en el modelo
        String ccPath = guardarArchivo(camaraComercio, "camaraComercio", id);
        String rutPath = guardarArchivo(rut, "file", id);

        // Verificar si hubo errores al guardar los archivos
        if (ccPath.startsWith("error") || rutPath.startsWith("error")) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al guardar los archivos: " +
                    (ccPath.startsWith("error") ? ccPath : rutPath));
        }

        comerciante.setCamaraComercio(ccPath);
        comerciante.setRut(rutPath);
        return ResponseEntity.ok(comercianteRepository.save(comerciante));
    }

    private String guardarArchivo(MultipartFile file, String tipo, int id) {
        try {
            if (file != null && !file.isEmpty()) {
                String nombreArchivofile = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
                String carpetaFile = "src/main/resources/static/usuarios/documentos/";
                File directorioFile = new File(carpetaFile);
                if (!directorioFile.exists())
                    directorioFile.mkdirs();
                Path rutaFile = Paths.get(carpetaFile, nombreArchivofile);
                Files.copy(file.getInputStream(), rutaFile, StandardCopyOption.REPLACE_EXISTING);

                String urlBase = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort();

                return urlBase + "/usuarios/documentos/" + nombreArchivofile;
            } else {
                throw new RuntimeException("error al subir el file");
            }
        } catch (Exception e) {
            return e.getMessage();
        }
    }
}