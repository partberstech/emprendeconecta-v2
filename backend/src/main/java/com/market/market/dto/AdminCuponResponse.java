package com.market.market.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class AdminCuponResponse {

    private Long id;
    private String codigo;
    private String tipoDescuento;
    private BigDecimal valorDescuento;
    private BigDecimal montoMinimo;
    private Integer usosMaximos;
    private Integer usosActuales;
    private LocalDateTime fechaExpiracion;
    private Boolean activo;
    private LocalDateTime fechaCreacion;

    public AdminCuponResponse() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCodigo() { return codigo; }
    public void setCodigo(String codigo) { this.codigo = codigo; }

    public String getTipoDescuento() { return tipoDescuento; }
    public void setTipoDescuento(String t) { this.tipoDescuento = t; }

    public BigDecimal getValorDescuento() { return valorDescuento; }
    public void setValorDescuento(BigDecimal v) { this.valorDescuento = v; }

    public BigDecimal getMontoMinimo() { return montoMinimo; }
    public void setMontoMinimo(BigDecimal m) { this.montoMinimo = m; }

    public Integer getUsosMaximos() { return usosMaximos; }
    public void setUsosMaximos(Integer u) { this.usosMaximos = u; }

    public Integer getUsosActuales() { return usosActuales; }
    public void setUsosActuales(Integer u) { this.usosActuales = u; }

    public LocalDateTime getFechaExpiracion() { return fechaExpiracion; }
    public void setFechaExpiracion(LocalDateTime f) { this.fechaExpiracion = f; }

    public Boolean getActivo() { return activo; }
    public void setActivo(Boolean a) { this.activo = a; }

    public LocalDateTime getFechaCreacion() { return fechaCreacion; }
    public void setFechaCreacion(LocalDateTime f) { this.fechaCreacion = f; }
}
