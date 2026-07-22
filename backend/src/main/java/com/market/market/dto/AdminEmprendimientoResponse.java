package com.market.market.dto;

public class AdminEmprendimientoResponse {

    private Long idEmprendimiento;
    private String nombreNegocio;
    private String descripcion;
    private String direccionFisica;
    private String estadoValidacion;
    private String nombreEmprendedor;
    private String correoEmprendedor;
    private Long idEmprendedor;
    private String telefonoEmprendedor;

    public AdminEmprendimientoResponse() {}

    public Long getIdEmprendimiento() { return idEmprendimiento; }
    public void setIdEmprendimiento(Long id) { this.idEmprendimiento = id; }

    public String getNombreNegocio() { return nombreNegocio; }
    public void setNombreNegocio(String n) { this.nombreNegocio = n; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String d) { this.descripcion = d; }

    public String getDireccionFisica() { return direccionFisica; }
    public void setDireccionFisica(String d) { this.direccionFisica = d; }

    public String getEstadoValidacion() { return estadoValidacion; }
    public void setEstadoValidacion(String e) { this.estadoValidacion = e; }

    public String getNombreEmprendedor() { return nombreEmprendedor; }
    public void setNombreEmprendedor(String n) { this.nombreEmprendedor = n; }

    public String getCorreoEmprendedor() { return correoEmprendedor; }
    public void setCorreoEmprendedor(String c) { this.correoEmprendedor = c; }

    public Long getIdEmprendedor() { return idEmprendedor; }
    public void setIdEmprendedor(Long id) { this.idEmprendedor = id; }

    public String getTelefonoEmprendedor() { return telefonoEmprendedor; }
    public void setTelefonoEmprendedor(String t) { this.telefonoEmprendedor = t; }
}
