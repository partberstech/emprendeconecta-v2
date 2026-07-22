package com.market.market.controladores;

import com.market.market.dto.CalificacionRequest;
import com.market.market.dto.CalificacionResumenResponse;
import com.market.market.services.CalificacionServicio;
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

@RestController
@RequestMapping("/api/v1/emprendimientos/{idEmprendimiento}/calificaciones")
public class CalificacionController {

    private final CalificacionServicio calificacionServicio;

    public CalificacionController(CalificacionServicio calificacionServicio) {
        this.calificacionServicio = calificacionServicio;
    }

    @PostMapping
    public ResponseEntity<CalificacionResumenResponse> calificar(
            @PathVariable Long idEmprendimiento,
            @Valid @RequestBody CalificacionRequest solicitud,
            Authentication autenticacion) {
        var respuesta = calificacionServicio.calificar(
                idEmprendimiento, solicitud, autenticacion.getName());
        return ResponseEntity.status(HttpStatus.CREATED).body(respuesta);
    }

    @GetMapping
    public ResponseEntity<CalificacionResumenResponse> listar(
            @PathVariable Long idEmprendimiento) {
        var respuesta = calificacionServicio.listarPorEmprendimiento(idEmprendimiento);
        return ResponseEntity.ok(respuesta);
    }
}
