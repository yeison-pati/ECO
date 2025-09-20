package com.itm.ecosurprise.filters;

import com.itm.ecosurprise.services.AuthService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

/**
 * Filtro JWT para autenticación
 * Este filtro:
 * 1. Intercepta todas las peticiones HTTP
 * 2. Verifica si la ruta es pública
 * 3. Extrae y valida el token JWT
 * 4. Establece la autenticación en el SecurityContext
 */

@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    @Autowired
    private AuthService authService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        // Agregar manejo explícito para solicitudes OPTIONS
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            // No hacer nada, solo permitir que la solicitud continúe
            filterChain.doFilter(request, response);
            return;
        }

        String path = request.getRequestURI();
        System.out.println("Request path: " + path);

        // Permite acceso a rutas públicas sin validación
        if (path.startsWith("/api/auth/") || path.startsWith("/usuarios/")) {
            filterChain.doFilter(request, response);
            return;
        }

        // Extrae el token
        String token = extractToken(request);
        System.out.println("Token extraído: " + token);

        // Si no hay token o no es válido, continuamos la cadena sin autenticación
        if (token == null || !authService.validateToken(token)) {
            System.out.println("Token inválido o expirado");
            filterChain.doFilter(request, response);
            return;
        }
        
        try {
            // Obtener información del token y establecer la autenticación
            String rol = authService.getRolFromToken(token);
            if (rol != null) {
                rol = rol.toUpperCase();
            }
            int userId = authService.getIdFromToken(token);

            // Crear autenticación y establecerla en el SecurityContext
            UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(userId, null,
                    Collections.singletonList(new SimpleGrantedAuthority(rol)));

            SecurityContextHolder.getContext().setAuthentication(authentication);
            System.out.println("Autenticación seteada en SecurityContextHolder: " + authentication);

        } catch (Exception e) {
            // En caso de error, limpiar el contexto de seguridad
            SecurityContextHolder.clearContext();
        }

        // Continuar con la cadena de filtros
        filterChain.doFilter(request, response);
    }

    private String extractToken(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}