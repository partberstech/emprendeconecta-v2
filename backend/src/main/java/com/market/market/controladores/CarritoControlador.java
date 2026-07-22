package com.market.market.controladores;

import com.market.market.dto.CarritoItemRequest;
import com.market.market.dto.CarritoResponse;
import com.market.market.dto.MensajeResponse;
import com.market.market.services.CarritoServicio;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/carrito")
public class CarritoControlador {

    private final CarritoServicio carritoServicio;

    public CarritoControlador(CarritoServicio carritoServicio) {
        this.carritoServicio = carritoServicio;
    }

    @GetMapping
    public ResponseEntity<CarritoResponse> obtenerCarrito(Authentication autenticacion) {
        var respuesta = carritoServicio.obtenerCarrito(autenticacion.getName());
        return ResponseEntity.ok(respuesta);
    }

    @PostMapping("/items")
    public ResponseEntity<CarritoResponse> agregarItem(
            @Valid @RequestBody CarritoItemRequest solicitud,
            Authentication autenticacion) {
        var respuesta = carritoServicio.agregarItem(autenticacion.getName(), solicitud);
        return ResponseEntity.status(HttpStatus.CREATED).body(respuesta);
    }

    @PutMapping("/items/{idItem}")
    public ResponseEntity<CarritoResponse> actualizarCantidad(
            @PathVariable Long idItem,
            @Valid @RequestBody CarritoItemRequest solicitud,
            Authentication autenticacion) {
        var respuesta = carritoServicio.actualizarCantidad(autenticacion.getName(), idItem, solicitud);
        return ResponseEntity.ok(respuesta);
    }

    @DeleteMapping("/items/{idItem}")
    public ResponseEntity<CarritoResponse> eliminarItem(
            @PathVariable Long idItem,
            Authentication autenticacion) {
        var respuesta = carritoServicio.eliminarItem(autenticacion.getName(), idItem);
        return ResponseEntity.ok(respuesta);
    }

    @DeleteMapping
    public ResponseEntity<Void> limpiarCarrito(Authentication autenticacion) {
        carritoServicio.limpiarCarrito(autenticacion.getName());
        return ResponseEntity.noContent().build();
    }
}
