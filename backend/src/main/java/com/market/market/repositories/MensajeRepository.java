package com.market.market.repositories;

import com.market.market.entities.Mensaje;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MensajeRepository extends JpaRepository<Mensaje, Long> {

    @Query("SELECT m FROM Mensaje m WHERE (m.remitente.idUsuario = :idUsuario1 AND m.destinatario.idUsuario = :idUsuario2) "
         + "OR (m.remitente.idUsuario = :idUsuario2 AND m.destinatario.idUsuario = :idUsuario1) "
         + "ORDER BY m.fechaEnvio ASC")
    List<Mensaje> findConversacion(@Param("idUsuario1") Long idUsuario1,
                                    @Param("idUsuario2") Long idUsuario2);

    @Query("SELECT m FROM Mensaje m WHERE (m.remitente.idUsuario = :idUsuario1 AND m.destinatario.idUsuario = :idUsuario2) "
         + "OR (m.remitente.idUsuario = :idUsuario2 AND m.destinatario.idUsuario = :idUsuario1) "
         + "ORDER BY m.fechaEnvio DESC")
    List<Mensaje> findUltimoMensaje(@Param("idUsuario1") Long idUsuario1,
                                     @Param("idUsuario2") Long idUsuario2,
                                     Pageable pageable);

    @Query(value = "SELECT DISTINCT CASE WHEN m.id_remitente = :idUsuario THEN m.id_destinatario ELSE m.id_remitente END "
         + "FROM mensajes m WHERE m.id_remitente = :idUsuario OR m.id_destinatario = :idUsuario",
           nativeQuery = true)
    List<Long> findIdsUsuariosConversacion(@Param("idUsuario") Long idUsuario);

    long countByDestinatarioIdUsuarioAndRemitenteIdUsuarioAndLeidoFalse(Long idDestinatario, Long idRemitente);

    long countByDestinatarioIdUsuarioAndLeidoFalse(Long idDestinatario);

    List<Mensaje> findByLeidoFalseAndDestinatarioIdUsuario(Long idDestinatario);
}
