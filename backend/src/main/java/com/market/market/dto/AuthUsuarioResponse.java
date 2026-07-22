package com.market.market.dto;

public class AuthUsuarioResponse {

    private Long id;
    private String nombreCompleto;
    private String correoElectronico;
    private String rol;

    public AuthUsuarioResponse() {}

    public AuthUsuarioResponse(Long id, String nombreCompleto, String correoElectronico, String rol) {
        this.id = id;
        this.nombreCompleto = nombreCompleto;
        this.correoElectronico = correoElectronico;
        this.rol = rol;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNombreCompleto() { return nombreCompleto; }
    public void setNombreCompleto(String nombreCompleto) { this.nombreCompleto = nombreCompleto; }

    public String getCorreoElectronico() { return correoElectronico; }
    public void setCorreoElectronico(String correoElectronico) { this.correoElectronico = correoElectronico; }

    public String getRol() { return rol; }
    public void setRol(String rol) { this.rol = rol; }
}
