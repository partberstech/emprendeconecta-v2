package com.market.market.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;

public class PerfilActualizarRequest {

    @Size(max = 100, message = "El nombre no debe exceder 100 caracteres")
    private String nombreCompleto;

    @Email(message = "Formato de correo inválido")
    @Size(max = 150, message = "El correo no debe exceder 150 caracteres")
    private String correoElectronico;

    @Size(max = 20, message = "El teléfono no debe exceder 20 caracteres")
    private String telefono;

    public PerfilActualizarRequest() {}

    public String getNombreCompleto() { return nombreCompleto; }
    public void setNombreCompleto(String nombreCompleto) { this.nombreCompleto = nombreCompleto; }

    public String getCorreoElectronico() { return correoElectronico; }
    public void setCorreoElectronico(String correoElectronico) { this.correoElectronico = correoElectronico; }

    public String getTelefono() { return telefono; }
    public void setTelefono(String telefono) { this.telefono = telefono; }
}
