package com.market.market.dto;

import java.time.LocalDateTime;

public class AdminCalificacionResponse {

    private Long id;
    private Integer puntuacion;
    private String comentario;
    private LocalDateTime fecha;
    private Long emprendimientoId;
    private Long usuarioId;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Integer getPuntuacion() { return puntuacion; }
    public void setPuntuacion(Integer puntuacion) { this.puntuacion = puntuacion; }

    public String getComentario() { return comentario; }
    public void setComentario(String comentario) { this.comentario = comentario; }

    public LocalDateTime getFecha() { return fecha; }
    public void setFecha(LocalDateTime fecha) { this.fecha = fecha; }

    public Long getEmprendimientoId() { return emprendimientoId; }
    public void setEmprendimientoId(Long emprendimientoId) { this.emprendimientoId = emprendimientoId; }

    public Long getUsuarioId() { return usuarioId; }
    public void setUsuarioId(Long usuarioId) { this.usuarioId = usuarioId; }
}
