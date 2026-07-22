package com.market.market.repositories;

import com.market.market.entities.Emprendimiento;
import com.market.market.entities.EstadoValidacion;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface EmprendimientoRepository extends JpaRepository<Emprendimiento, Long> {
    List<Emprendimiento> findByUsuarioIdUsuario(Long idUsuario);

    List<Emprendimiento> findByEstadoValidacion(EstadoValidacion estadoValidacion);

    Page<Emprendimiento> findByEstadoValidacion(EstadoValidacion estadoValidacion, Pageable pageable);

    Page<Emprendimiento> findByEstadoValidacionAndNombreNegocioContainingIgnoreCase(
            EstadoValidacion estadoValidacion, String nombreNegocio, Pageable pageable);

    Optional<Emprendimiento> findByIdEmprendimientoAndEstadoValidacion(Long idEmprendimiento, EstadoValidacion estadoValidacion);

    @Query(value = """
            SELECT e.id_emprendimiento,
                   (6371 * acos(cos(radians(:latitud)) * cos(radians(e.latitud)) *
                    cos(radians(e.longitud) - radians(:longitud)) +
                    sin(radians(:latitud)) * sin(radians(e.latitud)))) AS distancia
            FROM emprendimientos e
            WHERE e.estado_validacion = 'APROBADO'
              AND e.latitud IS NOT NULL
              AND e.longitud IS NOT NULL
            HAVING distancia < :radio
            ORDER BY distancia
            """, nativeQuery = true)
    List<Object[]> encontrarIdsCercanos(@Param("latitud") double latitud,
                                        @Param("longitud") double longitud,
                                        @Param("radio") double radio);
}
