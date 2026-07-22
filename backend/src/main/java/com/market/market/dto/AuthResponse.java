package com.market.market.dto;

public class AuthResponse {

    private String token;
    private String refreshToken;
    private AuthUsuarioResponse usuario;

    public AuthResponse() {}

    public AuthResponse(String token, String refreshToken, AuthUsuarioResponse usuario) {
        this.token = token;
        this.refreshToken = refreshToken;
        this.usuario = usuario;
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public String getRefreshToken() { return refreshToken; }
    public void setRefreshToken(String refreshToken) { this.refreshToken = refreshToken; }

    public AuthUsuarioResponse getUsuario() { return usuario; }
    public void setUsuario(AuthUsuarioResponse usuario) { this.usuario = usuario; }
}
