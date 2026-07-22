package com.market.market.dto;

import jakarta.validation.constraints.NotBlank;

public class CuponValidarRequest {

    @NotBlank(message = "El código del cupón es obligatorio")
    private String codigo;

    public CuponValidarRequest() {}

    public String getCodigo() { return codigo; }
    public void setCodigo(String codigo) { this.codigo = codigo; }
}
