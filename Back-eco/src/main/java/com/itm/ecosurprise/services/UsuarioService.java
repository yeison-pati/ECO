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
            // Validar el token y obtener el ID del usuario autenticado
            if (token == null || !authService.validateToken(token)) {
                // UNAUTHORIZED es correcto para tokens inválidos
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token inválido o expirado");
            }

            // Obtener el ID del usuario del token
            int idUsuarioAutenticado = authService.getIdFromToken(token);

            // Verificar que el usuario autenticado sea el mismo que intenta modificar
            if (idUsuarioAutenticado != idUsuario) {
                // FORBIDDEN es correcto para permisos insuficientes
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("No tienes permiso para modificar la imagen de otro usuario");
            }

            Usuario usuario = usuarioRepository.findById(idUsuario)
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

            // ELIMINAR IMAGEN ANTERIOR SI EXISTE
            if (usuario.getImagen() != null && !usuario.getImagen().isEmpty()) {
                try {
                    // Extraer el nombre del archivo de la URL
                    String urlImagenAnterior = usuario.getImagen();
                    String nombreArchivoAnterior = urlImagenAnterior.substring(urlImagenAnterior.lastIndexOf("/") + 1);
                    String rutaArchivoAnterior = "src/main/resources/static/usuarios/" + nombreArchivoAnterior;
                    File archivoAnterior = new File(rutaArchivoAnterior);
                    if (archivoAnterior.exists()) {
                        boolean deleted = archivoAnterior.delete();
                        System.out.println("Imagen anterior eliminada: " + deleted);
                    }
                } catch (Exception ex) {
                    System.out.println("No se pudo eliminar la imagen anterior: " + ex.getMessage());
                }
            }

            if (imagen != null && !imagen.isEmpty()) {
                // Generar nombre único para la imagen
                String nombreArchivo = UUID.randomUUID().toString() + "_" + imagen.getOriginalFilename();

                // Ruta local donde se guardará la imagen
                String carpeta = "src/main/resources/static/usuarios/";
                File directorio = new File(carpeta);
                if (!directorio.exists())
                    directorio.mkdirs();

                // Guardar archivo en disco
                Path ruta = Paths.get(carpeta + nombreArchivo);
                Files.copy(imagen.getInputStream(), ruta, StandardCopyOption.REPLACE_EXISTING);

                // Construir URL pública de acceso a la imagen
                String urlBase = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort();
                String urlImagen = urlBase + "/usuarios/" + nombreArchivo;

                // Guardar la URL de la imagen en el objeto Usuario
                usuario.setImagen(urlImagen);

                // Guardar el usuario actualizado
                return ResponseEntity.ok(usuarioRepository.save(usuario));
            } else {
                // BAD_REQUEST es correcto para datos de entrada inválidos
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Imagen vacía");
            }
        } catch (Exception e) {
            // Diferenciar entre "no encontrado" y otros errores
            if (e.getMessage().contains("no encontrado")) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
            }
            // INTERNAL_SERVER_ERROR para otros errores
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }
}