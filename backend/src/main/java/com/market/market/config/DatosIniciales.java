package com.market.market.config;

import com.market.market.entities.Categoria;
import com.market.market.entities.Emprendimiento;
import com.market.market.entities.EstadoValidacion;

import com.market.market.entities.ProductoServicio;
import com.market.market.entities.Rol;
import com.market.market.entities.Usuario;
import com.market.market.repositories.CategoriaRepository;
import com.market.market.repositories.EmprendimientoRepository;
import com.market.market.repositories.ProductoServicioRepository;
import com.market.market.repositories.UsuarioRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Component
@Order(1)
public class DatosIniciales implements CommandLineRunner {

    private static final String CONTRAENA_COMUN = "Test123456!";

    private final UsuarioRepository usuarioRepository;
    private final CategoriaRepository categoriaRepository;
    private final EmprendimientoRepository emprendimientoRepository;
    private final ProductoServicioRepository productoServicioRepository;
    private final PasswordEncoder codificadorContrasenas;

    public DatosIniciales(UsuarioRepository usuarioRepository,
                          CategoriaRepository categoriaRepository,
                          EmprendimientoRepository emprendimientoRepository,
                          ProductoServicioRepository productoServicioRepository,
                          PasswordEncoder codificadorContrasenas) {
        this.usuarioRepository = usuarioRepository;
        this.categoriaRepository = categoriaRepository;
        this.emprendimientoRepository = emprendimientoRepository;
        this.productoServicioRepository = productoServicioRepository;
        this.codificadorContrasenas = codificadorContrasenas;
    }

    @Override
    public void run(String... args) {
        if (categoriaRepository.count() > 0) {
            return;
        }

        var categorias = categoriaRepository.saveAll(List.of(
                new Categoria("Alimentos y Bebidas", "Productos comestibles y bebidas"),
                new Categoria("Artesanías", "Productos hechos a mano"),
                new Categoria("Ropa y Accesorios", "Indumentaria y complementos"),
                new Categoria("Servicios Profesionales", "Asesorías y servicios"),
                new Categoria("Tecnología", "Dispositivos y accesorios tecnológicos"),
                new Categoria("Salud y Belleza", "Productos de cuidado personal"),
                new Categoria("Hogar", "Artículos para el hogar"),
                new Categoria("Mascotas", "Productos y servicios para mascotas")
        ));

        var clave = codificadorContrasenas.encode(CONTRAENA_COMUN);

        var emprendedor = usuarioRepository.save(new Usuario(
                "María González", "maria@ejemplo.com", clave, Rol.EMPRENDEDOR, "912345678", true
        ));

        usuarioRepository.save(new Usuario(
                "Carlos Muñoz", "carlos@ejemplo.com", clave, Rol.CLIENTE, "976543210", true
        ));

        usuarioRepository.save(new Usuario(
                "Admin Sistema", "admin@ejemplo.com", clave,
                Rol.ADMINISTRADOR, null, true
        ));

        var emprendimiento = new Emprendimiento(
                emprendedor, "Repostería Doña María",
                "Av. Providencia 1234, Santiago", EstadoValidacion.APROBADO
        );
        emprendimiento.setDescripcion("Repostería artesanal con recetas tradicionales chilenas. Pasteles, tortas y postres.");
        emprendimiento.setLatitud(-33.4265);
        emprendimiento.setLongitud(-70.6065);
        emprendimiento.setLogoUrl("https://ejemplo.com/logos/reposteria.png");
        emprendimiento = emprendimientoRepository.save(emprendimiento);

        var catAlimentos = categorias.get(0);
        var catArtesanias = categorias.get(1);
        var catHogar = categorias.get(6);

        productoServicioRepository.saveAll(List.of(
                new ProductoServicio(emprendimiento, catAlimentos, "Torta de Tres Leches",
                        "Torta tradicional de tres leches, perfecta para celebraciones. Peso aproximado 1.5 kg.",
                        new BigDecimal("15000"), 10, "https://ejemplo.com/productos/torta-leches.png", true),
                new ProductoServicio(emprendimiento, catAlimentos, "Empanadas de Pino (docena)",
                        "Docena de empanadas de horno con pino tradicional: carne, cebolla, huevo, aceitunas y pasas.",
                        new BigDecimal("12000"), 20, "https://ejemplo.com/productos/empanadas.png", true),
                new ProductoServicio(emprendimiento, catAlimentos, "Alfajores Artesanales (caja x6)",
                        "Alfajores de maicena con relleno de manjar y coco rallado.",
                        new BigDecimal("5000"), 30, "https://ejemplo.com/productos/alfajores.png", true),
                new ProductoServicio(emprendimiento, catAlimentos, "Mermelada Casera de Frambuesa",
                        "Mermelada artesanal 100% natural, sin conservantes. Frasco 500 gr.",
                        new BigDecimal("4500"), 15, "https://ejemplo.com/productos/mermelada.png", true),
                new ProductoServicio(emprendimiento, catArtesanias, "Caja Sorpresa Artesanal",
                        "Caja decorada a mano con productos seleccionados de repostería.",
                        new BigDecimal("25000"), 5, "https://ejemplo.com/productos/caja-sorpresa.png", true),
                new ProductoServicio(emprendimiento, catHogar, "Set Individuales Tejidos (x4)",
                        "Individuales de mesa tejidos a crochet con diseños tradicionales chilenos.",
                        new BigDecimal("8000"), 12, "https://ejemplo.com/productos/individuales.png", true)
        ));
    }
}
