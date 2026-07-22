package com.market.market.dto;

import java.math.BigDecimal;

public class ProductoResponse {

    private Long idProducto;
    private String nombre;
    private String descripcion;
    private BigDecimal precio;
    private Integer stockDisponible;
    private String imagenUrl;
    private boolean estadoPublicacion;
    private Long idCategoria;
    private String nombreCategoria;
    private Long idEmprendimiento;
    private String nombreEmprendimiento;

    public ProductoResponse() {}

    public Long getIdProducto() { return idProducto; }
    public void setIdProducto(Long idProducto) { this.idProducto = idProducto; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    public BigDecimal getPrecio() { return precio; }
    public void setPrecio(BigDecimal precio) { this.precio = precio; }

    public Integer getStockDisponible() { return stockDisponible; }
    public void setStockDisponible(Integer stockDisponible) { this.stockDisponible = stockDisponible; }

    public String getImagenUrl() { return imagenUrl; }
    public void setImagenUrl(String imagenUrl) { this.imagenUrl = imagenUrl; }

    public boolean isEstadoPublicacion() { return estadoPublicacion; }
    public void setEstadoPublicacion(boolean estadoPublicacion) { this.estadoPublicacion = estadoPublicacion; }

    public Long getIdCategoria() { return idCategoria; }
    public void setIdCategoria(Long idCategoria) { this.idCategoria = idCategoria; }

    public String getNombreCategoria() { return nombreCategoria; }
    public void setNombreCategoria(String nombreCategoria) { this.nombreCategoria = nombreCategoria; }

    public Long getIdEmprendimiento() { return idEmprendimiento; }
    public void setIdEmprendimiento(Long idEmprendimiento) { this.idEmprendimiento = idEmprendimiento; }

    public String getNombreEmprendimiento() { return nombreEmprendimiento; }
    public void setNombreEmprendimiento(String nombreEmprendimiento) { this.nombreEmprendimiento = nombreEmprendimiento; }
}
