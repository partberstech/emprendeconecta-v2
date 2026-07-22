package com.market.market.controladores;

import com.market.market.dto.ConversacionResponse;
import com.market.market.dto.MensajeRequest;
import com.market.market.dto.MensajeResponse;
import com.market.market.services.MensajeServicio;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/mensajes")
public class MensajeController {

    private final MensajeServicio mensajeServicio;

    public MensajeController(MensajeServicio mensajeServicio) {
        this.mensajeServicio = mensajeServicio;
    }

    @PostMapping
    public ResponseEntity<MensajeResponse> enviar(
            @Valid @RequestBody MensajeRequest solicitud,
            Authentication autenticacion) {
        var respuesta = mensajeServicio.enviar(solicitud, autenticacion.getName());
        return ResponseEntity.status(HttpStatus.CREATED).body(respuesta);
    }

    @GetMapping("/conversaciones")
    public ResponseEntity<List<ConversacionResponse>> listarConversaciones(Authentication autenticacion) {
        var respuesta = mensajeServicio.listarConversaciones(autenticacion.getName());
        return ResponseEntity.ok(respuesta);
    }

    @GetMapping("/conversaciones/{idUsuarioDestino}")
    public ResponseEntity<List<MensajeResponse>> obtenerHistorial(
            @PathVariable Long idUsuarioDestino,
            Authentication autenticacion) {
        var respuesta = mensajeServicio.obtenerHistorial(idUsuarioDestino, autenticacion.getName());
        return ResponseEntity.ok(respuesta);
    }
}
