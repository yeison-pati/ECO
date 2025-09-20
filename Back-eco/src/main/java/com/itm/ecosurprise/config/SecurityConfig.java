package com.itm.ecosurprise.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import com.itm.ecosurprise.filters.JwtAuthFilter;

/**
 * Configuración de seguridad de la aplicación
 * Esta clase define:
 * 1. Las rutas públicas y protegidas
 * 2. La política de sesiones
 * 3. El filtro JWT
 * 4. El codificador de contraseñas
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;

    public SecurityConfig(JwtAuthFilter jwtAuthFilter) {
        this.jwtAuthFilter = jwtAuthFilter;
    }

    /**
     * Configura el codificador de contraseñas BCrypt
     * Se usa para encriptar contraseñas de forma segura
     */
    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * Configura la cadena de filtros de seguridad
     * Define:
     * 1. Rutas públicas (/api/auth/**) - No requieren autenticación
     * 2. Rutas por rol:
     * - /api/consumidores/** - Solo usuarios CONSUMIDOR
     * - /api/comerciantes/** - Solo usuarios COMERCIANTE
     * - /api/repartidores/** - Solo usuarios REPARTIDOR
     * 3. Otras rutas requieren autenticación
     * 4. Desactiva CSRF para API REST
     * 5. Configura sesiones sin estado (STATELESS)
     * 6. Agrega el filtro JWT antes del filtro de autenticación
     */

     @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                // Permitir OPTIONS para todas las rutas - esto es crucial para CORS
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                // Rutas públicas
                .requestMatchers("/api/auth/login", "/api/auth/register").permitAll()
                .requestMatchers("/api/auth/validate-token").permitAll()
                .requestMatchers("/productos/**").permitAll()
                .requestMatchers("/usuarios/**").permitAll()
                .requestMatchers("/api/error").permitAll()
                // Rutas por rol
                .requestMatchers("/api/consumidores/**").hasAuthority("CONSUMIDOR")
                .requestMatchers("/api/comerciantes/**").hasAuthority("COMERCIANTE")
                .requestMatchers("/api/repartidores/**").hasAuthority("REPARTIDOR")
                .anyRequest().authenticated())
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}