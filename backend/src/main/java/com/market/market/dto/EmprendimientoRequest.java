package com.market.market.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class EmprendimientoRequest {

    @NotBlank(message = "El nombre del negocio es obligatorio")
    @Size(max = 150, message = "El nombre no debe exceder 150 caracteres")
    private String nombreNegocio;

    @Size(max = 5000, message = "La descripción no debe exceder 5000 caracteres")
    private String descripcion;

    @Size(max = 255, message = "La dirección no debe exceder 255 caracteres")
    private String direccionFisica;

    private Double latitud;

    private Double longitud;

    @Size(max = 500, message = "La URL del logo no debe exceder 500 caracteres")
    private String logoUrl;

    public EmprendimientoRequest() {}

    public String getNombreNegocio() { return nombreNegocio; }
    public void setNombreNegocio(String nombreNegocio) { this.nombreNegocio = nombreNegocio; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    public String getDireccionFisica() { return direccionFisica; }
    public void setDireccionFisica(String direccionFisica) { this.direccionFisica = direccionFisica; }

    public Double getLatitud() { return latitud; }
    public void setLatitud(Double latitud) { this.latitud = latitud; }

    public Double getLongitud() { return longitud; }
    public void setLongitud(Double longitud) { this.longitud = longitud; }

    public String getLogoUrl() { return logoUrl; }
    public void setLogoUrl(String logoUrl) { this.logoUrl = logoUrl; }
}
