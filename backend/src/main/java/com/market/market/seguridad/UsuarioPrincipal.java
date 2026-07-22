package com.market.market.seguridad;

import com.market.market.entities.Usuario;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

public class UsuarioPrincipal implements UserDetails {

    private final Long id;
    private final String nombreCompleto;
    private final String correoElectronico;
    private final String contrasena;
    private final Collection<? extends GrantedAuthority> autoridades;
    private final boolean activo;

    public UsuarioPrincipal(Long id, String nombreCompleto, String correoElectronico,
                            String contrasena, Collection<? extends GrantedAuthority> autoridades,
                            boolean activo) {
        this.id = id;
        this.nombreCompleto = nombreCompleto;
        this.correoElectronico = correoElectronico;
        this.contrasena = contrasena;
        this.autoridades = autoridades;
        this.activo = activo;
    }

    public static UsuarioPrincipal crear(Usuario usuario) {
        var autoridad = new SimpleGrantedAuthority("ROLE_" + usuario.getRol().name());
        return new UsuarioPrincipal(
                usuario.getIdUsuario(),
                usuario.getNombreCompleto(),
                usuario.getCorreoElectronico(),
                usuario.getContrasena(),
                List.of(autoridad),
                usuario.getActivo()
        );
    }

    public Long getId() {
        return id;
    }

    public String getNombreCompleto() {
        return nombreCompleto;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return autoridades;
    }

    @Override
    public String getPassword() {
        return contrasena;
    }

    @Override
    public String getUsername() {
        return correoElectronico;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return activo;
    }
}
