package com.itm.ecosurprise.services;

import com.itm.ecosurprise.models.Usuario;
import com.itm.ecosurprise.models.Consumidor;
import com.itm.ecosurprise.models.Comerciante;
import com.itm.ecosurprise.models.Repartidor;
import com.itm.ecosurprise.models.Telefono;
import com.itm.ecosurprise.repositories.IComerciante;
import com.itm.ecosurprise.repositories.ITelefono;
import com.itm.ecosurprise.repositories.IUsuario;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

/**
 * Servicio de Autenticación y Autorización
 */
@Service
public class AuthService {

    @Autowired
    private ITelefono telefonoRepository;
    @Autowired
    private IComerciante comercianteRepository;
    @Autowired
    private IUsuario usuarioRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Value("${jwt.expiration}")
    private long jwtExpiration;

    @Value("${jwt.secret}")
    private String jwtSecret;

    public ResponseEntity<?> login(String correo, String contrasena) {
        try {
            System.out.println("=== Iniciando proceso de login ===");
            System.out.println("Buscando usuario con correo: " + correo);

            if (correo == null || correo.trim().isEmpty()) {
                System.out.println("Error: Correo vacío o nulo");
                Map<String, String> error = new HashMap<>();
                error.put("error", "Credenciales inválidas");
                error.put("message", "El correo no puede estar vacío");
                // BAD_REQUEST es correcto para datos de entrada inválidos
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
            }

            Optional<Usuario> usuarioOpt = usuarioRepository.findByCorreo(correo.trim());

            if (usuarioOpt.isEmpty()) {
                System.out.println("Usuario no encontrado para correo: " + correo);
                Map<String, String> error = new HashMap<>();
                error.put("error", "Credenciales inválidas");
                error.put("message", "El correo no está registrado");
                // UNAUTHORIZED es correcto para credenciales inválidas
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
            }

            Usuario usuario = usuarioOpt.get();
            System.out.println("Usuario encontrado: " + usuario.getNombre());
            System.out.println("Rol del usuario: " + usuario.getRol());

            if (contrasena == null || contrasena.trim().isEmpty()) {
                System.out.println("Error: Contraseña vacía o nula");
                Map<String, String> error = new HashMap<>();
                error.put("error", "Credenciales inválidas");
                error.put("message", "La contraseña no puede estar vacía");
                // BAD_REQUEST es correcto para datos de entrada inválidos
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
            }

            boolean passwordMatches = passwordEncoder.matches(contrasena.trim(), usuario.getContrasena());
            System.out.println("¿Las contraseñas coinciden?: " + passwordMatches);

            if (!passwordMatches) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Credenciales inválidas");
                error.put("message", "La contraseña es incorrecta");
                // UNAUTHORIZED es correcto para credenciales inválidas
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
            }

            String token = generateToken(usuario);
            System.out.println("Token generado exitosamente");

            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("rol", usuario.getRol());
            response.put("idUsuario", usuario.getIdUsuario());
            response.put("correo", usuario.getCorreo());
            response.put("nombre", usuario.getNombre());
            response.put("telefono", usuario.getTelefono());
            response.put("imagen", usuario.getImagen());
            response.put("message", "Login exitoso");
            if(usuario.getRol().contentEquals("COMERCIANTE")){
                try {
                    Comerciante comerciante = comercianteRepository.findById(usuario.getIdUsuario()).get();
                    response.put("nit", comerciante.getNit());
                } catch (Exception e) {
                    System.err.println("Error en login de comerciante: " + e.getMessage());
                    e.printStackTrace();
                    Map<String, String> error = new HashMap<>();
                    error.put("error", "Error interno del servidor");
                    error.put("message", e.getMessage());
                    // INTERNAL_SERVER_ERROR es correcto para errores de servidor
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
                }
            }

            System.out.println("=== Login exitoso ===");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("Error en login: " + e.getMessage());
            e.printStackTrace();
            Map<String, String> error = new HashMap<>();
            error.put("error", "Error interno del servidor");
            error.put("message", e.getMessage());
            // INTERNAL_SERVER_ERROR es correcto para errores inesperados
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    public ResponseEntity<?> register(Map<String, Object> userData) {
        try {
            String rol = (String) userData.get("rol");
            Usuario usuario;

            switch (rol.toUpperCase()) {
                case "CONSUMIDOR":
                    usuario = new Consumidor();
                    break;
                case "COMERCIANTE":
                    usuario = new Comerciante();
                    break;
                case "REPARTIDOR":
                    usuario = new Repartidor();
                    break;
                default:
                    // BAD_REQUEST es correcto para datos de entrada inválidos
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Rol no válido");
            }

            if (usuarioRepository.findByCorreo((String) userData.get("correo")).isPresent()) {
                // CONFLICT es mejor para recursos que ya existen
                return ResponseEntity.status(HttpStatus.CONFLICT).body("El correo ingresado se encuentra en uso");

            }

            Map<String, String> telefonotoVer = (Map<String, String>) userData.get("telefono");
            if (telefonotoVer != null && usuarioRepository.findByNumero(telefonotoVer.get("numero")).isPresent()) {
                // CONFLICT es mejor para recursos que ya existen
                return ResponseEntity.status(HttpStatus.CONFLICT).body("El teléfono ingresado se encuentra en uso");
            }

            usuario.setNombre((String) userData.get("nombre"));
            usuario.setCorreo((String) userData.get("correo"));
            usuario.setContrasena(passwordEncoder.encode((String) userData.get("contrasena")));
            usuario.setRol(rol);

            usuario = usuarioRepository.save(usuario);

            Map<String, String> telefonoData = (Map<String, String>) userData.get("telefono");
            if (telefonoData != null) {
                String indicativo = telefonoData.get("indicativo");
                String numero = telefonoData.get("numero");

                if (numero != null && !numero.isEmpty() && indicativo != null && !indicativo.isEmpty()) {
                    Telefono telefono = new Telefono();
                    telefono.setNumero(numero);
                    telefono.setIndicativo(indicativo);
                    telefono.setUsuario(usuario);

                    Telefono telefonoGuardado = telefonoRepository.save(telefono);

                    usuario.setTelefono(telefonoGuardado);
                    usuario = usuarioRepository.save(usuario);
                }
            }

            // CREATED es mejor para recursos creados exitosamente
            return ResponseEntity.status(HttpStatus.CREATED).body(usuario);
        } catch (Exception e) {
            e.printStackTrace();
            // INTERNAL_SERVER_ERROR es correcto para errores inesperados
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al registrar usuario: " + e.getMessage());
        }
    }
    /**
     * Genera un token JWT para un usuario
     *
     * El token incluye:
     * - Subject: Email del usuario
     * - Claims:
     *   - rol: Rol del usuario (CONSUMIDOR, COMERCIANTE, REPARTIDOR)
     *   - id: ID del usuario
     * - Fecha de emisión
     * - Fecha de expiración (24 horas por defecto)
     *
     * @param usuario Usuario para el cual generar el token
     * @return Token JWT firmado
     */
    private String generateToken(Usuario usuario) {
        try {
            System.out.println("Generando token para usuario: " + usuario.getCorreo());
            byte[] keyBytes = jwtSecret.getBytes();

            String token = Jwts.builder()
                    .setSubject(usuario.getCorreo())
                    .claim("rol", usuario.getRol())
                    .claim("id", usuario.getIdUsuario())
                    .setIssuedAt(new Date())
                    .setExpiration(new Date(System.currentTimeMillis() + jwtExpiration))
                    .signWith(Keys.hmacShaKeyFor(keyBytes), SignatureAlgorithm.HS512)
                    .compact();

            System.out.println("Token generado exitosamente");
            return token;
        } catch (Exception e) {
            System.err.println("Error al generar token: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Error al generar el token JWT: " + e.getMessage());
        }
    }

    /**
     * Valida un token JWT
     * 
     * Verifica:
     * - Que el token esté correctamente firmado
     * - Que no haya expirado
     * - Que tenga el formato correcto
     * 
     * @param token Token JWT a validar
     * @return true si el token es válido, false en caso contrario
     */
    public boolean validateToken(String token) {
        try {
            byte[] keyBytes = jwtSecret.getBytes();
            
            Jwts.parserBuilder()
                .setSigningKey(Keys.hmacShaKeyFor(keyBytes))
                .build()
                .parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            System.err.println("Error al validar token: " + e.getMessage());
            return false;
        }
    }

    /**
     * Extrae el rol de un token JWT
     * 
     * @param token Token JWT válido
     * @return Rol del usuario (CONSUMIDOR, COMERCIANTE, REPARTIDOR)
     * @throws Exception si el token es inválido o no contiene el rol
     */
    public String getRolFromToken(String token) {
        try {
            byte[] keyBytes = jwtSecret.getBytes();
            
            Claims claims = Jwts.parserBuilder()
                .setSigningKey(Keys.hmacShaKeyFor(keyBytes))
                .build()
                .parseClaimsJws(token)
                .getBody();
            return claims.get("rol", String.class);
        } catch (Exception e) {
            System.err.println("Error al obtener rol del token: " + e.getMessage());
            throw new RuntimeException("Error al obtener el rol del token: " + e.getMessage());
        }
    }

    public int getIdFromToken(String token) {
        try {
            byte[] keyBytes = jwtSecret.getBytes();
            Claims claims = Jwts.parserBuilder()
                .setSigningKey(Keys.hmacShaKeyFor(keyBytes))
                .build()
                .parseClaimsJws(token)
                .getBody();
            
            return claims.get("id", Integer.class);
        } catch (Exception e) {
            throw new RuntimeException("Error al extraer ID del token: " + e.getMessage());
        }
    }

    /**
     * Renueva un token JWT válido
     * 
     * @param oldToken Token JWT actual
     * @return Nuevo token JWT con nueva fecha de expiración
     */
    public String renewToken(String oldToken) {
        try {
            byte[] keyBytes = jwtSecret.getBytes();
            
            // Extraer claims del token actual
            Claims claims = Jwts.parserBuilder()
                .setSigningKey(Keys.hmacShaKeyFor(keyBytes))
                .build()
                .parseClaimsJws(oldToken)
                .getBody();
            
            // Generar nuevo token con los mismos claims pero nueva fecha de expiración
            return Jwts.builder()
                    .setSubject(claims.getSubject())
                    .claim("rol", claims.get("rol"))
                    .claim("id", claims.get("id"))
                    .setIssuedAt(new Date())
                    .setExpiration(new Date(System.currentTimeMillis() + jwtExpiration))
                    .signWith(Keys.hmacShaKeyFor(keyBytes), SignatureAlgorithm.HS512)
                    .compact();
        } catch (Exception e) {
            System.err.println("Error al renovar token: " + e.getMessage());
            throw new RuntimeException("Error al renovar el token JWT: " + e.getMessage());
        }
    }
} 