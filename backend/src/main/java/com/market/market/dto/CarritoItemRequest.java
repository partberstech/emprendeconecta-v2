package com.market.market.dto;

import java.math.BigDecimal;

public class CarritoItemRequest {

    private Long idProducto;
    private Integer cantidad;

    public CarritoItemRequest() {}

    public CarritoItemRequest(Long idProducto, Integer cantidad) {
        this.idProducto = idProducto;
        this.cantidad = cantidad;
    }

    public Long getIdProducto() { return idProducto; }
    public void setIdProducto(Long idProducto) { this.idProducto = idProducto; }

    public Integer getCantidad() { return cantidad; }
    public void setCantidad(Integer cantidad) { this.cantidad = cantidad; }
}
