package com.market.market.seguridad;

import com.market.market.repositories.UsuarioRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class UsuarioDetallesServicio implements UserDetailsService {

    private final UsuarioRepository usuarioRepository;

    public UsuarioDetallesServicio(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String correoElectronico) throws UsernameNotFoundException {
        var usuario = usuarioRepository.findByCorreoElectronico(correoElectronico)
                .orElseThrow(() -> new UsernameNotFoundException(
                        "Usuario no encontrado con el correo: " + correoElectronico));
        return UsuarioPrincipal.crear(usuario);
    }
}
