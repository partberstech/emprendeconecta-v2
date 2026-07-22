package com.market.market.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class AdminPedidoResumenResponse {

    private Long id;
    private String cliente;
    private String emprendimiento;
    private BigDecimal total;
    private String estado;
    private LocalDateTime fecha;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCliente() { return cliente; }
    public void setCliente(String cliente) { this.cliente = cliente; }

    public String getEmprendimiento() { return emprendimiento; }
    public void setEmprendimiento(String emprendimiento) { this.emprendimiento = emprendimiento; }

    public BigDecimal getTotal() { return total; }
    public void setTotal(BigDecimal total) { this.total = total; }

    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }

    public LocalDateTime getFecha() { return fecha; }
    public void setFecha(LocalDateTime fecha) { this.fecha = fecha; }
}
