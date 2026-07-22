package com.market.market.dto;

import com.market.market.entities.EstadoPedido;
import com.market.market.entities.MetodoPago;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class PedidoResponse {

    private Long idPedido;
    private LocalDateTime fechaPedido;
    private BigDecimal total;
    private MetodoPago metodoPago;
    private EstadoPedido estadoPedido;
    private Long idCliente;
    private String nombreCliente;
    private Long idEmprendimiento;
    private String nombreEmprendimiento;
    private Long idCupon;
    private String codigoCupon;
    private List<DetallePedidoResponse> detalles;

    public PedidoResponse() {}

    public Long getIdPedido() { return idPedido; }
    public void setIdPedido(Long idPedido) { this.idPedido = idPedido; }

    public LocalDateTime getFechaPedido() { return fechaPedido; }
    public void setFechaPedido(LocalDateTime fechaPedido) { this.fechaPedido = fechaPedido; }

    public BigDecimal getTotal() { return total; }
    public void setTotal(BigDecimal total) { this.total = total; }

    public MetodoPago getMetodoPago() { return metodoPago; }
    public void setMetodoPago(MetodoPago metodoPago) { this.metodoPago = metodoPago; }

    public EstadoPedido getEstadoPedido() { return estadoPedido; }
    public void setEstadoPedido(EstadoPedido estadoPedido) { this.estadoPedido = estadoPedido; }

    public Long getIdCliente() { return idCliente; }
    public void setIdCliente(Long idCliente) { this.idCliente = idCliente; }

    public String getNombreCliente() { return nombreCliente; }
    public void setNombreCliente(String nombreCliente) { this.nombreCliente = nombreCliente; }

    public Long getIdEmprendimiento() { return idEmprendimiento; }
    public void setIdEmprendimiento(Long idEmprendimiento) { this.idEmprendimiento = idEmprendimiento; }

    public String getNombreEmprendimiento() { return nombreEmprendimiento; }
    public void setNombreEmprendimiento(String nombreEmprendimiento) { this.nombreEmprendimiento = nombreEmprendimiento; }

    public Long getIdCupon() { return idCupon; }
    public void setIdCupon(Long idCupon) { this.idCupon = idCupon; }

    public String getCodigoCupon() { return codigoCupon; }
    public void setCodigoCupon(String codigoCupon) { this.codigoCupon = codigoCupon; }

    public List<DetallePedidoResponse> getDetalles() { return detalles; }
    public void setDetalles(List<DetallePedidoResponse> detalles) { this.detalles = detalles; }
}
