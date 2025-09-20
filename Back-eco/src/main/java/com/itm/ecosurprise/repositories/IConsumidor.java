package com.itm.ecosurprise.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


import com.itm.ecosurprise.models.Consumidor;

@Repository
public interface IConsumidor extends JpaRepository<Consumidor, Integer> {
      
    /*@Query("SELECT c FROM Consumidor c WHERE c.email = ?1 and c.password = ?2")
    public Consumidor findByEmail(String email, String password);*/
}
