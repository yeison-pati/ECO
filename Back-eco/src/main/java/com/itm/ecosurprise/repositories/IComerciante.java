package com.itm.ecosurprise.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.itm.ecosurprise.models.Comerciante;

@Repository
public interface IComerciante extends JpaRepository<Comerciante, Integer> {

}
