package com.market.market.repositories;

import com.market.market.entities.Cupon;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CuponRepository extends JpaRepository<Cupon, Long> {
    Optional<Cupon> findByCodigo(String codigo);
}
