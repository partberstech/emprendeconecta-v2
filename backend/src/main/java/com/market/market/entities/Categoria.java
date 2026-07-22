package com.market.market.entities;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "categorias")
public class Categoria {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idCategoria;

    @Column(nullable = false, length = 100)
    private String nombreCategoria;

    @Column(length = 255)
    private String descripcion;

    @OneToMany(mappedBy = "categoria")
    private List<ProductoServicio> productosServicios = new ArrayList<>();

    public Categoria() {}

    public Categoria(String nombreCategoria, String descripcion) {
        this.nombreCategoria = nombreCategoria;
        this.descripcion = descripcion;
    }

    public Long getIdCategoria() { return idCategoria; }
    public void setIdCategoria(Long idCategoria) { this.idCategoria = idCategoria; }

    public String getNombreCategoria() { return nombreCategoria; }
    public void setNombreCategoria(String nombreCategoria) { this.nombreCategoria = nombreCategoria; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    public List<ProductoServicio> getProductosServicios() { return productosServicios; }
    public void setProductosServicios(List<ProductoServicio> productosServicios) { this.productosServicios = productosServicios; }
}
