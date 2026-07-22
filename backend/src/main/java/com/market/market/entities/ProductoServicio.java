package com.market.market.entities;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "productos_servicios")
public class ProductoServicio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idProducto;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_emprendimiento", nullable = false)
    private Emprendimiento emprendimiento;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_categoria", nullable = false)
    private Categoria categoria;

    @Column(nullable = false, length = 150)
    private String nombre;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal precio;

    @Column(nullable = false)
    private Integer stockDisponible;

    @Column(length = 500)
    private String imagenUrl;

    @Column(nullable = false)
    private Boolean estadoPublicacion;

    public ProductoServicio() {}

    public ProductoServicio(Emprendimiento emprendimiento, Categoria categoria, String nombre, String descripcion, BigDecimal precio, Integer stockDisponible, String imagenUrl, Boolean estadoPublicacion) {
        this.emprendimiento = emprendimiento;
        this.categoria = categoria;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.precio = precio;
        this.stockDisponible = stockDisponible;
        this.imagenUrl = imagenUrl;
        this.estadoPublicacion = estadoPublicacion;
    }

    public Long getIdProducto() { return idProducto; }
    public void setIdProducto(Long idProducto) { this.idProducto = idProducto; }

    public Emprendimiento getEmprendimiento() { return emprendimiento; }
    public void setEmprendimiento(Emprendimiento emprendimiento) { this.emprendimiento = emprendimiento; }

    public Categoria getCategoria() { return categoria; }
    public void setCategoria(Categoria categoria) { this.categoria = categoria; }

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

    public Boolean getEstadoPublicacion() { return estadoPublicacion; }
    public void setEstadoPublicacion(Boolean estadoPublicacion) { this.estadoPublicacion = estadoPublicacion; }
}
