package com.market.market.repositories;

import com.market.market.entities.Pedido;
import com.market.market.entities.EstadoPedido;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public interface PedidoRepository extends JpaRepository<Pedido, Long> {
    Page<Pedido> findByClienteIdUsuario(Long idCliente, Pageable pageable);

    Page<Pedido> findByEmprendimientoIdEmprendimiento(Long idEmprendimiento, Pageable pageable);

    List<Pedido> findByEstadoPedido(EstadoPedido estadoPedido);

    boolean existsByClienteIdUsuarioAndEmprendimientoIdEmprendimientoAndEstadoPedido(
            Long idCliente, Long idEmprendimiento, EstadoPedido estadoPedido);

    long countByEmprendimientoIdEmprendimientoAndEstadoPedido(Long idEmprendimiento, EstadoPedido estado);

    @Query("SELECT COALESCE(SUM(p.total), 0) FROM Pedido p WHERE p.emprendimiento.idEmprendimiento = :idEmprendimiento AND p.estadoPedido = :estado")
    BigDecimal sumTotalByEmprendimientoIdEmprendimientoAndEstadoPedido(@Param("idEmprendimiento") Long idEmprendimiento, @Param("estado") EstadoPedido estado);

    @Query("SELECT COALESCE(SUM(p.total), 0) FROM Pedido p WHERE p.emprendimiento.idEmprendimiento = :idEmprendimiento AND p.fechaPedido BETWEEN :inicio AND :fin")
    BigDecimal sumTotalByEmprendimientoIdEmprendimientoAndFechaPedidoBetween(@Param("idEmprendimiento") Long idEmprendimiento, @Param("inicio") LocalDateTime inicio, @Param("fin") LocalDateTime fin);

    @Query("SELECT COUNT(DISTINCT p.cliente.idUsuario) FROM Pedido p WHERE p.emprendimiento.idEmprendimiento = :idEmprendimiento")
    long countDistinctClienteByEmprendimientoIdEmprendimiento(@Param("idEmprendimiento") Long idEmprendimiento);

    long countByEstadoPedido(EstadoPedido estado);

    @Query("SELECT COALESCE(SUM(p.total), 0) FROM Pedido p WHERE p.estadoPedido = 'ENTREGADO'")
    BigDecimal sumTotalVentas();
}
