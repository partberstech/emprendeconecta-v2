package com.market.market.repositories;

import com.market.market.entities.CarritoItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CarritoItemRepository extends JpaRepository<CarritoItem, Long> {

    Optional<CarritoItem> findByCarritoIdCarritoAndIdProducto(Long idCarrito, Long idProducto);
}
