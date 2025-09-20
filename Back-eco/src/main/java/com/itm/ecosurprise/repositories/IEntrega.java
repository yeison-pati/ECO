package com.itm.ecosurprise.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.itm.ecosurprise.models.Entrega;

public interface IEntrega extends JpaRepository<Entrega, Integer> {
}
