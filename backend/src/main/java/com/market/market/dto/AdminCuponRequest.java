package com.market.market.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public class AdminCuponRequest {

    @NotBlank(message = "El código es obligatorio")
    private String codigo;

    @NotBlank(message = "El tipo de descuento es obligatorio")
    private String tipoDescuento;

    @NotNull(message = "El valor del descuento es obligatorio")
    @Positive(message = "El valor del descuento debe ser positivo")
    private BigDecimal valorDescuento;

    private BigDecimal montoMinimo;

    private Integer usosMaximos;

    @NotNull(message = "La fecha de expiración es obligatoria")
    private LocalDateTime fechaExpiracion;

    public AdminCuponRequest() {}

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

    public LocalDateTime getFechaExpiracion() { return fechaExpiracion; }
    public void setFechaExpiracion(LocalDateTime f) { this.fechaExpiracion = f; }
}
