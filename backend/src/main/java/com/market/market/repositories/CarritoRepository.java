package com.market.market.repositories;

import com.market.market.entities.Carrito;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CarritoRepository extends JpaRepository<Carrito, Long> {

    Optional<Carrito> findByIdUsuarioAndEstado(Long idUsuario, String estado);

    Optional<Carrito> findByIdUsuarioAndEstadoAndIdCarrito(Long idUsuario, String estado, Long idCarrito);
}
