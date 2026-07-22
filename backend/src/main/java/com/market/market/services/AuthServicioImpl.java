package com.market.market.services;

import com.market.market.dto.AuthResponse;
import com.market.market.dto.AuthUsuarioResponse;
import com.market.market.dto.LoginRequest;
import com.market.market.dto.PerfilActualizarRequest;
import com.market.market.dto.PerfilResponse;
import com.market.market.dto.RegistroRequest;
import com.market.market.entities.Usuario;
import com.market.market.exceptions.AuthExcepcion;
import com.market.market.repositories.UsuarioRepository;
import com.market.market.seguridad.JwtUtil;
import com.market.market.seguridad.UsuarioPrincipal;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthServicioImpl implements AuthServicio {

    private static final String USUARIO_NO_ENCONTRADO = "Usuario no encontrado";

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder codificadorContrasenas;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager administradorAutenticacion;

    public AuthServicioImpl(UsuarioRepository usuarioRepository,
                            PasswordEncoder codificadorContrasenas,
                            JwtUtil jwtUtil,
                            AuthenticationManager administradorAutenticacion) {
        this.usuarioRepository = usuarioRepository;
        this.codificadorContrasenas = codificadorContrasenas;
        this.jwtUtil = jwtUtil;
        this.administradorAutenticacion = administradorAutenticacion;
    }

    @Override
    public AuthResponse registrar(RegistroRequest solicitud) {
        if (usuarioRepository.findByCorreoElectronico(solicitud.getCorreoElectronico()).isPresent()) {
            throw new AuthExcepcion("El correo electrónico ya está registrado");
        }

        var contrasenaCodificada = codificadorContrasenas.encode(solicitud.getContrasena());

        var usuario = new Usuario(
                solicitud.getNombreCompleto(),
                solicitud.getCorreoElectronico(),
                contrasenaCodificada,
                solicitud.getRol(),
                solicitud.getTelefono(),
                true
        );

        usuario = usuarioRepository.save(usuario);
        var token = jwtUtil.generarToken(
                usuario.getIdUsuario(),
                usuario.getCorreoElectronico(),
                usuario.getRol().name()
        );

        return new AuthResponse(
                token,
                new AuthUsuarioResponse(
                        usuario.getIdUsuario(),
                        usuario.getNombreCompleto(),
                        usuario.getCorreoElectronico(),
                        usuario.getRol().name()
                )
        );
    }

    @Override
    public AuthResponse login(LoginRequest solicitud) {
        var autenticacionToken = new UsernamePasswordAuthenticationToken(
                solicitud.getCorreoElectronico(),
                solicitud.getContrasena()
        );
        var autenticacion = administradorAutenticacion.authenticate(autenticacionToken);
        var principal = autenticacion.getPrincipal();

        if (!(principal instanceof UsuarioPrincipal usuarioPrincipal)) {
            throw new AuthExcepcion("Error interno de autenticación");
        }

        var usuario = usuarioRepository.findByCorreoElectronico(usuarioPrincipal.getUsername())
                .orElseThrow(() -> new AuthExcepcion(USUARIO_NO_ENCONTRADO));

        var token = jwtUtil.generarToken(
                usuario.getIdUsuario(),
                usuario.getCorreoElectronico(),
                usuario.getRol().name()
        );

        return new AuthResponse(
                token,
                new AuthUsuarioResponse(
                        usuario.getIdUsuario(),
                        usuario.getNombreCompleto(),
                        usuario.getCorreoElectronico(),
                        usuario.getRol().name()
                )
        );
    }

    @Override
    public PerfilResponse obtenerPerfil(Long idUsuario) {
        var usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new AuthExcepcion(USUARIO_NO_ENCONTRADO));

        return construirPerfil(usuario);
    }

    @Override
    public PerfilResponse obtenerPerfilPorCorreo(String correoElectronico) {
        var usuario = usuarioRepository.findByCorreoElectronico(correoElectronico)
                .orElseThrow(() -> new AuthExcepcion(USUARIO_NO_ENCONTRADO));

        return construirPerfil(usuario);
    }

    @Override
    public PerfilResponse actualizarPerfil(String correoElectronico, PerfilActualizarRequest solicitud) {
        var usuario = usuarioRepository.findByCorreoElectronico(correoElectronico)
                .orElseThrow(() -> new AuthExcepcion(USUARIO_NO_ENCONTRADO));

        if (solicitud.getNombreCompleto() != null) {
            usuario.setNombreCompleto(solicitud.getNombreCompleto());
        }
        if (solicitud.getTelefono() != null) {
            usuario.setTelefono(solicitud.getTelefono());
        }
        if (solicitud.getCorreoElectronico() != null) {
            if (usuarioRepository.findByCorreoElectronico(solicitud.getCorreoElectronico()).isPresent()
                    && !solicitud.getCorreoElectronico().equals(correoElectronico)) {
                throw new AuthExcepcion("El correo electrónico ya está registrado");
            }
            usuario.setCorreoElectronico(solicitud.getCorreoElectronico());
        }

        usuario = usuarioRepository.save(usuario);
        return construirPerfil(usuario);
    }

    private PerfilResponse construirPerfil(Usuario usuario) {
        return new PerfilResponse(
                usuario.getIdUsuario(),
                usuario.getNombreCompleto(),
                usuario.getCorreoElectronico(),
                usuario.getRol().name(),
                usuario.getTelefono(),
                usuario.getFechaRegistro(),
                usuario.getActivo()
        );
    }
}
