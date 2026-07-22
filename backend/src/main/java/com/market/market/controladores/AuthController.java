package com.market.market.controladores;

import com.market.market.dto.AuthResponse;
import com.market.market.dto.LoginRequest;
import com.market.market.dto.PerfilActualizarRequest;
import com.market.market.dto.PerfilResponse;
import com.market.market.dto.RegistroRequest;
import com.market.market.services.AuthServicio;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final AuthServicio authServicio;

    public AuthController(AuthServicio authServicio) {
        this.authServicio = authServicio;
    }

    @PostMapping("/registro")
    public ResponseEntity<AuthResponse> registrar(@Valid @RequestBody RegistroRequest solicitud) {
        var respuesta = authServicio.registrar(solicitud);
        return ResponseEntity.status(HttpStatus.CREATED).body(respuesta);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest solicitud) {
        var respuesta = authServicio.login(solicitud);
        return ResponseEntity.ok(respuesta);
    }

    @GetMapping("/perfil")
    public ResponseEntity<PerfilResponse> perfil(Authentication autenticacion) {
        var respuesta = authServicio.obtenerPerfilPorCorreo(autenticacion.getName());
        return ResponseEntity.ok(respuesta);
    }

    @PutMapping("/perfil")
    public ResponseEntity<PerfilResponse> actualizarPerfil(
            Authentication autenticacion,
            @Valid @RequestBody PerfilActualizarRequest solicitud) {
        var respuesta = authServicio.actualizarPerfil(autenticacion.getName(), solicitud);
        return ResponseEntity.ok(respuesta);
    }
}
