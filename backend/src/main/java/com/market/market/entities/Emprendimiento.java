package com.market.market.entities;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "emprendimientos")
public class Emprendimiento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idEmprendimiento;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario usuario;

    @Column(nullable = false, length = 150)
    private String nombreNegocio;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    @Column(length = 255)
    private String direccionFisica;

    private Double latitud;

    private Double longitud;

    @Column(length = 500)
    private String logoUrl;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private EstadoValidacion estadoValidacion;

    @OneToMany(mappedBy = "emprendimiento", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProductoServicio> productosServicios = new ArrayList<>();

    @OneToMany(mappedBy = "emprendimiento")
    private List<Pedido> pedidos = new ArrayList<>();

    public Emprendimiento() {}

    public Emprendimiento(Usuario usuario, String nombreNegocio, String direccionFisica, EstadoValidacion estadoValidacion) {
        this.usuario = usuario;
        this.nombreNegocio = nombreNegocio;
        this.direccionFisica = direccionFisica;
        this.estadoValidacion = estadoValidacion;
    }

    public Long getIdEmprendimiento() { return idEmprendimiento; }
    public void setIdEmprendimiento(Long idEmprendimiento) { this.idEmprendimiento = idEmprendimiento; }

    public Usuario getUsuario() { return usuario; }
    public void setUsuario(Usuario usuario) { this.usuario = usuario; }

    public String getNombreNegocio() { return nombreNegocio; }
    public void setNombreNegocio(String nombreNegocio) { this.nombreNegocio = nombreNegocio; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    public String getDireccionFisica() { return direccionFisica; }
    public void setDireccionFisica(String direccionFisica) { this.direccionFisica = direccionFisica; }

    public Double getLatitud() { return latitud; }
    public void setLatitud(Double latitud) { this.latitud = latitud; }

    public Double getLongitud() { return longitud; }
    public void setLongitud(Double longitud) { this.longitud = longitud; }

    public String getLogoUrl() { return logoUrl; }
    public void setLogoUrl(String logoUrl) { this.logoUrl = logoUrl; }

    public EstadoValidacion getEstadoValidacion() { return estadoValidacion; }
    public void setEstadoValidacion(EstadoValidacion estadoValidacion) { this.estadoValidacion = estadoValidacion; }

    public List<ProductoServicio> getProductosServicios() { return productosServicios; }
    public void setProductosServicios(List<ProductoServicio> productosServicios) { this.productosServicios = productosServicios; }

    public List<Pedido> getPedidos() { return pedidos; }
    public void setPedidos(List<Pedido> pedidos) { this.pedidos = pedidos; }
}
