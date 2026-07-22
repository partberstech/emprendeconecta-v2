package com.market.market.controladores;

import com.market.market.dto.CuponValidarRequest;
import com.market.market.dto.CuponValidarResponse;
import com.market.market.services.CuponServicio;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/cupones")
public class CuponController {

    private final CuponServicio cuponServicio;

    public CuponController(CuponServicio cuponServicio) {
        this.cuponServicio = cuponServicio;
    }

    @PostMapping("/validar")
    public ResponseEntity<CuponValidarResponse> validar(@Valid @RequestBody CuponValidarRequest solicitud) {
        var respuesta = cuponServicio.validar(solicitud);
        return ResponseEntity.ok(respuesta);
    }
}
