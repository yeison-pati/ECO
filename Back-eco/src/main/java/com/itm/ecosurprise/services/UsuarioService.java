package com.itm.ecosurprise.services;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.itm.ecosurprise.models.Usuario;
import com.itm.ecosurprise.repositories.IUsuario;

import jakarta.servlet.http.HttpServletRequest;

@Service
public class UsuarioService {
    @Autowired
    private IUsuario usuarioRepository;
    @Autowired
    private AuthService authService;
    @Autowired
    private HttpServletRequest request;

    public ResponseEntity<?> setImagen(int idUsuario, MultipartFile imagen, String token) {
        try {

            if (token == null || !authService.validateToken(token)) {

                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token inválido o expirado");
            }


            int idUsuarioAutenticado = authService.getIdFromToken(token);


            if (idUsuarioAutenticado != idUsuario) {

                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("No tienes permiso para modificar la imagen de otro usuario");
            }

            Usuario usuario = usuarioRepository.findById(idUsuario)
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));


            if (usuario.getImagen() != null && !usuario.getImagen().isEmpty()) {
                try {

                    String urlImagenAnterior = usuario.getImagen();
                    String nombreArchivoAnterior = urlImagenAnterior.substring(urlImagenAnterior.lastIndexOf("/") + 1);
                    String rutaArchivoAnterior = "src/main/resources/static/usuarios/" + nombreArchivoAnterior;
                    File archivoAnterior = new File(rutaArchivoAnterior);
                    if (archivoAnterior.exists()) {
                        archivoAnterior.delete();
                    }
                } catch (Exception ex) {
                }
            }

            if (imagen != null && !imagen.isEmpty()) {

                String nombreArchivo = UUID.randomUUID().toString() + "_" + imagen.getOriginalFilename();


                String carpeta = "src/main/resources/static/usuarios/";
                File directorio = new File(carpeta);
                if (!directorio.exists())
                    directorio.mkdirs();


                Path ruta = Paths.get(carpeta + nombreArchivo);
                Files.copy(imagen.getInputStream(), ruta, StandardCopyOption.REPLACE_EXISTING);


                String urlBase = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort();
                String urlImagen = urlBase + "/usuarios/" + nombreArchivo;


                usuario.setImagen(urlImagen);


                return ResponseEntity.ok(usuarioRepository.save(usuario));
            } else {

                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Imagen vacía");
            }
        } catch (Exception e) {

            if (e.getMessage().contains("no encontrado")) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
            }

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }
}