package com.market.market.dto;

import jakarta.validation.constraints.NotBlank;

public class AdminEmprendimientoUpdateRequest {

    @NotBlank(message = "El estado de validación es obligatorio")
    private String estadoValidacion;

    public AdminEmprendimientoUpdateRequest() {}

    public String getEstadoValidacion() { return estadoValidacion; }
    public void setEstadoValidacion(String estadoValidacion) { this.estadoValidacion = estadoValidacion; }
}
