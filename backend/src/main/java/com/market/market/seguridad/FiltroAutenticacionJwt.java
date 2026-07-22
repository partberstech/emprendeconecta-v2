package com.market.market.seguridad;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;


@Component
public class FiltroAutenticacionJwt extends OncePerRequestFilter {

    private static final String ENCABEZADO_AUTORIZACION = "Authorization";
    private static final String PREFIJO_TOKEN = "Bearer ";

    private final JwtUtil jwtUtil;

    public FiltroAutenticacionJwt(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest peticion, HttpServletResponse respuesta,
                                    FilterChain cadenaFiltro) throws ServletException, IOException {
        var token = extraerToken(peticion);

        if (token != null && jwtUtil.esTokenValido(token)) {
            var correo = jwtUtil.extraerCorreo(token);
            var roles = jwtUtil.extraerRoles(token);
            var autoridades = roles.stream()
                    .map(SimpleGrantedAuthority::new)
                    .toList();

            var autenticacion = new UsernamePasswordAuthenticationToken(
                    correo, null, autoridades);
            autenticacion.setDetails(
                    new WebAuthenticationDetailsSource().buildDetails(peticion));

            SecurityContextHolder.getContext().setAuthentication(autenticacion);
        }

        cadenaFiltro.doFilter(peticion, respuesta);
    }

    private String extraerToken(HttpServletRequest peticion) {
        var encabezado = peticion.getHeader(ENCABEZADO_AUTORIZACION);

        if (StringUtils.hasText(encabezado) && encabezado.startsWith(PREFIJO_TOKEN)) {
            return encabezado.substring(PREFIJO_TOKEN.length());
        }

        return null;
    }
}
