package com.market.market.dto;

import java.time.LocalDateTime;

public class ConversacionResponse {

    private Long idUsuario;
    private String nombreCompleto;
    private String ultimoMensaje;
    private LocalDateTime fechaUltimoMensaje;
    private long noLeidos;

    public ConversacionResponse() {}

    public Long getIdUsuario() { return idUsuario; }
    public void setIdUsuario(Long idUsuario) { this.idUsuario = idUsuario; }

    public String getNombreCompleto() { return nombreCompleto; }
    public void setNombreCompleto(String nombreCompleto) { this.nombreCompleto = nombreCompleto; }

    public String getUltimoMensaje() { return ultimoMensaje; }
    public void setUltimoMensaje(String ultimoMensaje) { this.ultimoMensaje = ultimoMensaje; }

    public LocalDateTime getFechaUltimoMensaje() { return fechaUltimoMensaje; }
    public void setFechaUltimoMensaje(LocalDateTime fechaUltimoMensaje) { this.fechaUltimoMensaje = fechaUltimoMensaje; }

    public long getNoLeidos() { return noLeidos; }
    public void setNoLeidos(long noLeidos) { this.noLeidos = noLeidos; }
}
