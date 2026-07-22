package com.market.market.repositories;

import com.market.market.entities.Calificacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface CalificacionRepository extends JpaRepository<Calificacion, Long> {

    List<Calificacion> findByEmprendimientoIdEmprendimientoOrderByFechaCalificacionDesc(Long idEmprendimiento);

    Optional<Calificacion> findByClienteIdUsuarioAndEmprendimientoIdEmprendimiento(Long idCliente, Long idEmprendimiento);

    @Query("SELECT AVG(c.puntuacion) FROM Calificacion c WHERE c.emprendimiento.idEmprendimiento = :idEmprendimiento")
    Double promedioPorEmprendimiento(@Param("idEmprendimiento") Long idEmprendimiento);

    @Query("SELECT COUNT(c) FROM Calificacion c WHERE c.emprendimiento.idEmprendimiento = :idEmprendimiento")
    Long contarPorEmprendimiento(@Param("idEmprendimiento") Long idEmprendimiento);

    @Query("SELECT c FROM Calificacion c WHERE "
         + "(:idEmprendimiento IS NULL OR c.emprendimiento.idEmprendimiento = :idEmprendimiento) "
         + "AND (:puntuacionMin IS NULL OR c.puntuacion >= :puntuacionMin) "
         + "ORDER BY c.fechaCalificacion DESC")
    List<Calificacion> filtrar(@Param("idEmprendimiento") Long idEmprendimiento,
                               @Param("puntuacionMin") Integer puntuacionMin);
}
