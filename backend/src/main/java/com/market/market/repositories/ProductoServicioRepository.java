package com.market.market.repositories;

import com.market.market.entities.ProductoServicio;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;

public interface ProductoServicioRepository extends JpaRepository<ProductoServicio, Long> {

    List<ProductoServicio> findByEmprendimientoIdEmprendimientoAndEstadoPublicacionTrue(Long idEmprendimiento);

    Page<ProductoServicio> findByEstadoPublicacionTrue(Pageable pageable);

    Page<ProductoServicio> findByEstadoPublicacionTrueAndNombreContainingIgnoreCase(
            String nombre, Pageable pageable);

    Page<ProductoServicio> findByEstadoPublicacionTrueAndCategoriaIdCategoria(
            Long idCategoria, Pageable pageable);

    Page<ProductoServicio> findByEstadoPublicacionTrueAndPrecioBetween(
            BigDecimal precioMin, BigDecimal precioMax, Pageable pageable);

    Page<ProductoServicio> findByEstadoPublicacionTrueAndNombreContainingIgnoreCaseAndCategoriaIdCategoria(
            String nombre, Long idCategoria, Pageable pageable);

    List<ProductoServicio> findByEstadoPublicacion(Boolean estadoPublicacion);

    @Query("SELECT p FROM ProductoServicio p WHERE p.estadoPublicacion = true "
         + "AND (:nombre IS NULL OR LOWER(p.nombre) LIKE LOWER(CONCAT('%', :nombre, '%'))) "
         + "AND (:idCategoria IS NULL OR p.categoria.idCategoria = :idCategoria) "
         + "AND (:precioMin IS NULL OR p.precio >= :precioMin) "
         + "AND (:precioMax IS NULL OR p.precio <= :precioMax)")
    Page<ProductoServicio> buscarConFiltros(@Param("nombre") String nombre,
                                             @Param("idCategoria") Long idCategoria,
                                             @Param("precioMin") BigDecimal precioMin,
                                             @Param("precioMax") BigDecimal precioMax,
                                             Pageable pageable);
}
