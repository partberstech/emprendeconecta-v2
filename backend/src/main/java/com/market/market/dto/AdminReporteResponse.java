package com.market.market.dto;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

public class AdminReporteResponse {

    private long totalUsuarios;
    private long totalEmprendedores;
    private long totalClientes;
    private long totalEmprendimientos;
    private long totalProductos;
    private long totalPedidos;
    private long totalMensajes;
    private long totalCalificaciones;
    private Map<String, Long> pedidosPorEstado;
    private BigDecimal ventasTotales;
    private List<AdminPedidoResumenResponse> ultimosPedidos;
    private List<AdminUsuarioResumenResponse> ultimosRegistros;

    public long getTotalUsuarios() { return totalUsuarios; }
    public void setTotalUsuarios(long totalUsuarios) { this.totalUsuarios = totalUsuarios; }

    public long getTotalEmprendedores() { return totalEmprendedores; }
    public void setTotalEmprendedores(long totalEmprendedores) { this.totalEmprendedores = totalEmprendedores; }

    public long getTotalClientes() { return totalClientes; }
    public void setTotalClientes(long totalClientes) { this.totalClientes = totalClientes; }

    public long getTotalEmprendimientos() { return totalEmprendimientos; }
    public void setTotalEmprendimientos(long totalEmprendimientos) { this.totalEmprendimientos = totalEmprendimientos; }

    public long getTotalProductos() { return totalProductos; }
    public void setTotalProductos(long totalProductos) { this.totalProductos = totalProductos; }

    public long getTotalPedidos() { return totalPedidos; }
    public void setTotalPedidos(long totalPedidos) { this.totalPedidos = totalPedidos; }

    public long getTotalMensajes() { return totalMensajes; }
    public void setTotalMensajes(long totalMensajes) { this.totalMensajes = totalMensajes; }

    public long getTotalCalificaciones() { return totalCalificaciones; }
    public void setTotalCalificaciones(long totalCalificaciones) { this.totalCalificaciones = totalCalificaciones; }

    public Map<String, Long> getPedidosPorEstado() { return pedidosPorEstado; }
    public void setPedidosPorEstado(Map<String, Long> pedidosPorEstado) { this.pedidosPorEstado = pedidosPorEstado; }

    public BigDecimal getVentasTotales() { return ventasTotales; }
    public void setVentasTotales(BigDecimal ventasTotales) { this.ventasTotales = ventasTotales; }

    public List<AdminPedidoResumenResponse> getUltimosPedidos() { return ultimosPedidos; }
    public void setUltimosPedidos(List<AdminPedidoResumenResponse> ultimosPedidos) { this.ultimosPedidos = ultimosPedidos; }

    public List<AdminUsuarioResumenResponse> getUltimosRegistros() { return ultimosRegistros; }
    public void setUltimosRegistros(List<AdminUsuarioResumenResponse> ultimosRegistros) { this.ultimosRegistros = ultimosRegistros; }
}
