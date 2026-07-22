package com.market.market.controladores;

import com.market.market.dto.EstadoPedidoRequest;
import com.market.market.dto.PedidoRequest;
import com.market.market.dto.PedidoResponse;
import com.market.market.services.PedidoServicio;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1")
public class PedidoController {

    private final PedidoServicio pedidoServicio;

    public PedidoController(PedidoServicio pedidoServicio) {
        this.pedidoServicio = pedidoServicio;
    }

    @PostMapping("/pedidos")
    public ResponseEntity<PedidoResponse> crear(
            @Valid @RequestBody PedidoRequest solicitud,
            Authentication autenticacion) {
        var respuesta = pedidoServicio.crear(solicitud, autenticacion.getName());
        return ResponseEntity.status(HttpStatus.CREATED).body(respuesta);
    }

    @GetMapping("/pedidos/mis-compras")
    public ResponseEntity<Page<PedidoResponse>> misCompras(
            Authentication autenticacion,
            @RequestParam(defaultValue = "0") int pagina,
            @RequestParam(defaultValue = "10") int tamanio) {
        var respuesta = pedidoServicio.listarMisCompras(autenticacion.getName(), pagina, tamanio);
        return ResponseEntity.ok(respuesta);
    }

    @GetMapping("/emprendimientos/{idEmprendimiento}/pedidos")
    public ResponseEntity<Page<PedidoResponse>> pedidosPorEmprendimiento(
            @PathVariable Long idEmprendimiento,
            Authentication autenticacion,
            @RequestParam(defaultValue = "0") int pagina,
            @RequestParam(defaultValue = "10") int tamanio) {
        var respuesta = pedidoServicio.listarPedidosPorEmprendimiento(
                idEmprendimiento, autenticacion.getName(), pagina, tamanio);
        return ResponseEntity.ok(respuesta);
    }

    @PutMapping("/pedidos/{idPedido}/estado")
    public ResponseEntity<PedidoResponse> actualizarEstado(
            @PathVariable Long idPedido,
            @Valid @RequestBody EstadoPedidoRequest solicitud,
            Authentication autenticacion) {
        var respuesta = pedidoServicio.actualizarEstado(
                idPedido, solicitud, autenticacion.getName());
        return ResponseEntity.ok(respuesta);
    }
}
