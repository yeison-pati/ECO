package com.itm.ecosurprise.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.itm.ecosurprise.models.Usuario;
import java.util.Optional;


@Repository
public interface IUsuario extends JpaRepository<Usuario, Integer> {
    
    @Query("SELECT u FROM Usuario u WHERE u.correo = :correo")
    Optional<Usuario> findByCorreo(String correo);

    @Query("SELECT u FROM Usuario u WHERE u.telefono.numero = :numero")
    Optional<Usuario> findByNumero(String numero);
}
