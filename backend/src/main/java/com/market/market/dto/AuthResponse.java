package com.market.market.dto;

public class AuthResponse {

    private String token;
    private AuthUsuarioResponse usuario;

    public AuthResponse() {}

    public AuthResponse(String token, AuthUsuarioResponse usuario) {
        this.token = token;
        this.usuario = usuario;
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public AuthUsuarioResponse getUsuario() { return usuario; }
    public void setUsuario(AuthUsuarioResponse usuario) { this.usuario = usuario; }
}
