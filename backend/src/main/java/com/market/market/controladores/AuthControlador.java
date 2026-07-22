package com.market.market.controladores;

import com.market.market.dto.AuthResponse;
import com.market.market.dto.LoginRequest;
import com.market.market.dto.MensajeResponse;
import com.market.market.dto.PerfilActualizarRequest;
import com.market.market.dto.PerfilResponse;
import com.market.market.dto.RefreshTokenRequest;
import com.market.market.dto.RegistroRequest;
import com.market.market.services.AuthServicio;
import com.market.market.seguridad.JwtUtil;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthControlador {

    private final AuthServicio authServicio;
    private final JwtUtil jwtUtil;

    public AuthControlador(AuthServicio authServicio, JwtUtil jwtUtil) {
        this.authServicio = authServicio;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/registro")
    public ResponseEntity<AuthResponse> registrar(@Valid @RequestBody RegistroRequest solicitud) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(authServicio.registrar(solicitud));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest solicitud) {
        return ResponseEntity.ok(authServicio.login(solicitud));
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refrescarToken(
            @Valid @RequestBody RefreshTokenRequest solicitud) {
        return ResponseEntity.ok(authServicio.refrescarToken(solicitud));
    }

    @GetMapping("/perfil")
    public ResponseEntity<PerfilResponse> obtenerPerfil(
            @RequestHeader("Authorization") String token) {
        var correo = extraerCorreo(token);
        return ResponseEntity.ok(authServicio.obtenerPerfilPorCorreo(correo));
    }

    @PutMapping("/perfil")
    public ResponseEntity<PerfilResponse> actualizarPerfil(
            @RequestHeader("Authorization") String token,
            @Valid @RequestBody PerfilActualizarRequest solicitud) {
        var correo = extraerCorreo(token);
        return ResponseEntity.ok(authServicio.actualizarPerfil(correo, solicitud));
    }

    private String extraerCorreo(String token) {
        return jwtUtil.extraerCorreo(token.replace("Bearer ", ""));
    }
}
