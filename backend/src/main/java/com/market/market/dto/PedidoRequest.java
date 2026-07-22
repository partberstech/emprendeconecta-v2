package com.market.market.dto;

import com.market.market.entities.MetodoPago;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public class PedidoRequest {

    @NotNull(message = "El ID del emprendimiento es obligatorio")
    private Long idEmprendimiento;

    @NotNull(message = "El método de pago es obligatorio")
    private MetodoPago metodoPago;

    @NotEmpty(message = "Debe incluir al menos un producto")
    @Valid
    private List<DetallePedidoRequest> detalles;

    private Long idCupon;

    public PedidoRequest() {}

    public Long getIdEmprendimiento() { return idEmprendimiento; }
    public void setIdEmprendimiento(Long idEmprendimiento) { this.idEmprendimiento = idEmprendimiento; }

    public MetodoPago getMetodoPago() { return metodoPago; }
    public void setMetodoPago(MetodoPago metodoPago) { this.metodoPago = metodoPago; }

    public List<DetallePedidoRequest> getDetalles() { return detalles; }
    public void setDetalles(List<DetallePedidoRequest> detalles) { this.detalles = detalles; }

    public Long getIdCupon() { return idCupon; }
    public void setIdCupon(Long idCupon) { this.idCupon = idCupon; }
}
