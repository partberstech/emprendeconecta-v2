package com.market.market.seguridad;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.List;

@Component
public class JwtUtil {

    private final SecretKey claveFirma;
    private final long expiracion;

    public JwtUtil(@Value("${app.jwt.secret}") String secreto,
                   @Value("${app.jwt.expiracion}") long expiracion) {
        this.claveFirma = Keys.hmacShaKeyFor(secreto.getBytes(StandardCharsets.UTF_8));
        this.expiracion = expiracion;
    }

    public String generarToken(Long idUsuario, String correo, String rol) {
        var ahora = Instant.now();
        var vencimiento = ahora.plusMillis(expiracion);

        return Jwts.builder()
                .subject(correo)
                .claim("id", idUsuario)
                .claim("rol", rol)
                .issuedAt(java.util.Date.from(ahora))
                .expiration(java.util.Date.from(vencimiento))
                .signWith(claveFirma)
                .compact();
    }

    public String extraerCorreo(String token) {
        return extraerClaims(token).getSubject();
    }

    public List<String> extraerRoles(String token) {
        var rol = extraerClaims(token).get("rol", String.class);
        return List.of("ROLE_" + rol);
    }

    public Long extraerIdUsuario(String token) {
        return extraerClaims(token).get("id", Long.class);
    }

    public boolean esTokenValido(String token) {
        try {
            extraerClaims(token);
            return true;
        } catch (JwtException e) {
            return false;
        }
    }

    private Claims extraerClaims(String token) {
        return Jwts.parser()
                .verifyWith(claveFirma)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}
