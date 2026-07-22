package com.market.market.entities;

import com.market.market.utils.FechaUtil;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "cupones")
public class Cupon {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idCupon;

    @Column(nullable = false, unique = true, length = 50)
    private String codigo;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private TipoDescuento tipoDescuento;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal valorDescuento;

    @Column(precision = 10, scale = 2)
    private BigDecimal montoMinimo;

    private Integer usosMaximos;

    @Column(nullable = false)
    private Integer usosActuales = 0;

    @Column(nullable = false)
    private LocalDateTime fechaExpiracion;

    @Column(nullable = false)
    private Boolean activo = true;

    @Column(nullable = false, updatable = false)
    private LocalDateTime fechaCreacion;

    @PrePersist
    protected void onCreate() {
        fechaCreacion = FechaUtil.ahora();
        if (usosActuales == null) usosActuales = 0;
        if (activo == null) activo = true;
    }

    public Cupon() {}

    public Long getIdCupon() { return idCupon; }
    public void setIdCupon(Long id) { this.idCupon = id; }

    public String getCodigo() { return codigo; }
    public void setCodigo(String codigo) { this.codigo = codigo; }

    public TipoDescuento getTipoDescuento() { return tipoDescuento; }
    public void setTipoDescuento(TipoDescuento t) { this.tipoDescuento = t; }

    public BigDecimal getValorDescuento() { return valorDescuento; }
    public void setValorDescuento(BigDecimal v) { this.valorDescuento = v; }

    public BigDecimal getMontoMinimo() { return montoMinimo; }
    public void setMontoMinimo(BigDecimal m) { this.montoMinimo = m; }

    public Integer getUsosMaximos() { return usosMaximos; }
    public void setUsosMaximos(Integer u) { this.usosMaximos = u; }

    public Integer getUsosActuales() { return usosActuales; }
    public void setUsosActuales(Integer u) { this.usosActuales = u; }

    public LocalDateTime getFechaExpiracion() { return fechaExpiracion; }
    public void setFechaExpiracion(LocalDateTime f) { this.fechaExpiracion = f; }

    public Boolean getActivo() { return activo; }
    public void setActivo(Boolean a) { this.activo = a; }

    public LocalDateTime getFechaCreacion() { return fechaCreacion; }
    public void setFechaCreacion(LocalDateTime f) { this.fechaCreacion = f; }
}
