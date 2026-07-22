package com.market.market.dto;

import java.time.LocalDateTime;

public class MensajeResponse {

    private String mensaje;
    private Long idMensaje;
    private Long idRemitente;
    private String nombreRemitente;
    private Long idDestinatario;
    private String nombreDestinatario;
    private String contenido;
    private LocalDateTime fechaEnvio;
    private boolean leido;

    public MensajeResponse() {}

    public MensajeResponse(String mensaje) {
        this.mensaje = mensaje;
    }

    public Long getIdMensaje() { return idMensaje; }
    public void setIdMensaje(Long idMensaje) { this.idMensaje = idMensaje; }

    public Long getIdRemitente() { return idRemitente; }
    public void setIdRemitente(Long idRemitente) { this.idRemitente = idRemitente; }

    public String getNombreRemitente() { return nombreRemitente; }
    public void setNombreRemitente(String nombreRemitente) { this.nombreRemitente = nombreRemitente; }

    public Long getIdDestinatario() { return idDestinatario; }
    public void setIdDestinatario(Long idDestinatario) { this.idDestinatario = idDestinatario; }

    public String getNombreDestinatario() { return nombreDestinatario; }
    public void setNombreDestinatario(String nombreDestinatario) { this.nombreDestinatario = nombreDestinatario; }

    public String getContenido() { return contenido; }
    public void setContenido(String contenido) { this.contenido = contenido; }

    public LocalDateTime getFechaEnvio() { return fechaEnvio; }
    public void setFechaEnvio(LocalDateTime fechaEnvio) { this.fechaEnvio = fechaEnvio; }

    public boolean isLeido() { return leido; }
    public void setLeido(boolean leido) { this.leido = leido; }

    public String getMensaje() { return mensaje; }
    public void setMensaje(String mensaje) { this.mensaje = mensaje; }
}
