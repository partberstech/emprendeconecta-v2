package com.market.market.dto;

import java.math.BigDecimal;

public class CuponValidarResponse {

    private Long id;
    private String codigo;
    private String tipoDescuento;
    private BigDecimal valorDescuento;

    public CuponValidarResponse() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCodigo() { return codigo; }
    public void setCodigo(String codigo) { this.codigo = codigo; }

    public String getTipoDescuento() { return tipoDescuento; }
    public void setTipoDescuento(String t) { this.tipoDescuento = t; }

    public BigDecimal getValorDescuento() { return valorDescuento; }
    public void setValorDescuento(BigDecimal v) { this.valorDescuento = v; }
}
