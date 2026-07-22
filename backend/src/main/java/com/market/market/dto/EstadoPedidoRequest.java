package com.market.market.dto;

import com.market.market.entities.EstadoPedido;
import jakarta.validation.constraints.NotNull;

public class EstadoPedidoRequest {

    @NotNull(message = "El estado es obligatorio")
    private EstadoPedido estado;

    public EstadoPedidoRequest() {}

    public EstadoPedido getEstado() { return estado; }
    public void setEstado(EstadoPedido estado) { this.estado = estado; }
}
