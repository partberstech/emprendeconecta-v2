package com.market.market.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class MensajeRequest {

    @NotNull(message = "El destinatario es obligatorio")
    private Long idDestinatario;

    @NotBlank(message = "El contenido no puede estar vacío")
    @Size(max = 5000, message = "El mensaje no debe exceder 5000 caracteres")
    private String contenido;

    public MensajeRequest() {}

    public Long getIdDestinatario() { return idDestinatario; }
    public void setIdDestinatario(Long idDestinatario) { this.idDestinatario = idDestinatario; }

    public String getContenido() { return contenido; }
    public void setContenido(String contenido) { this.contenido = contenido; }
}
