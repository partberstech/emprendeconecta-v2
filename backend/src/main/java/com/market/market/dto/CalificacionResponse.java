package com.market.market.dto;

import java.time.LocalDateTime;

public class CalificacionResponse {

    private Long idCalificacion;
    private Integer puntuacion;
    private String comentario;
    private LocalDateTime fechaCalificacion;
    private Long idCliente;
    private String nombreCliente;

    public CalificacionResponse() {}

    public Long getIdCalificacion() { return idCalificacion; }
    public void setIdCalificacion(Long idCalificacion) { this.idCalificacion = idCalificacion; }

    public Integer getPuntuacion() { return puntuacion; }
    public void setPuntuacion(Integer puntuacion) { this.puntuacion = puntuacion; }

    public String getComentario() { return comentario; }
    public void setComentario(String comentario) { this.comentario = comentario; }

    public LocalDateTime getFechaCalificacion() { return fechaCalificacion; }
    public void setFechaCalificacion(LocalDateTime fechaCalificacion) { this.fechaCalificacion = fechaCalificacion; }

    public Long getIdCliente() { return idCliente; }
    public void setIdCliente(Long idCliente) { this.idCliente = idCliente; }

    public String getNombreCliente() { return nombreCliente; }
    public void setNombreCliente(String nombreCliente) { this.nombreCliente = nombreCliente; }
}
