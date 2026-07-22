package com.market.market.services;

import com.market.market.dto.AuthResponse;
import com.market.market.dto.LoginRequest;
import com.market.market.dto.PerfilActualizarRequest;
import com.market.market.dto.PerfilResponse;
import com.market.market.dto.RegistroRequest;

public interface AuthServicio {

    AuthResponse registrar(RegistroRequest solicitud);

    AuthResponse login(LoginRequest solicitud);

    PerfilResponse obtenerPerfil(Long idUsuario);

    PerfilResponse obtenerPerfilPorCorreo(String correoElectronico);

    PerfilResponse actualizarPerfil(String correoElectronico, PerfilActualizarRequest solicitud);
}
