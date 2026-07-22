package com.market.market.dto;

import java.math.BigDecimal;
import java.util.Map;

public class EmprendimientoEstadisticasResponse {

    private long visitasHoy;
    private BigDecimal ventasHoy;
    private long totalProductos;
    private long pedidosPendientes;
    private BigDecimal ventasTotales;
    private Map<String, Long> pedidosPorEstado;
    private long productosBajoStock;
    private long totalClientes;

    public long getVisitasHoy() { return visitasHoy; }
    public void setVisitasHoy(long visitasHoy) { this.visitasHoy = visitasHoy; }

    public BigDecimal getVentasHoy() { return ventasHoy; }
    public void setVentasHoy(BigDecimal ventasHoy) { this.ventasHoy = ventasHoy; }

    public long getTotalProductos() { return totalProductos; }
    public void setTotalProductos(long totalProductos) { this.totalProductos = totalProductos; }

    public long getPedidosPendientes() { return pedidosPendientes; }
    public void setPedidosPendientes(long pedidosPendientes) { this.pedidosPendientes = pedidosPendientes; }

    public BigDecimal getVentasTotales() { return ventasTotales; }
    public void setVentasTotales(BigDecimal ventasTotales) { this.ventasTotales = ventasTotales; }

    public Map<String, Long> getPedidosPorEstado() { return pedidosPorEstado; }
    public void setPedidosPorEstado(Map<String, Long> pedidosPorEstado) { this.pedidosPorEstado = pedidosPorEstado; }

    public long getProductosBajoStock() { return productosBajoStock; }
    public void setProductosBajoStock(long productosBajoStock) { this.productosBajoStock = productosBajoStock; }

    public long getTotalClientes() { return totalClientes; }
    public void setTotalClientes(long totalClientes) { this.totalClientes = totalClientes; }
}
