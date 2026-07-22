package com.market.market.services;

import com.market.market.dto.CategoriaRequest;
import com.market.market.dto.CategoriaResponse;
import com.market.market.dto.ProductoRequest;
import com.market.market.dto.ProductoResponse;
import com.market.market.entities.Categoria;
import com.market.market.entities.Rol;
import com.market.market.exceptions.AccesoDenegadoExcepcion;
import com.market.market.exceptions.AuthExcepcion;
import com.market.market.exceptions.RecursoNoEncontradoExcepcion;
import com.market.market.repositories.CategoriaRepository;
import com.market.market.repositories.EmprendimientoRepository;
import com.market.market.repositories.ProductoServicioRepository;
import com.market.market.repositories.UsuarioRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class CatalogoServicioImpl implements CatalogoServicio {

    private static final String USUARIO_NO_ENCONTRADO = "Usuario no encontrado";
    private static final String PRODUCTO_NO_ENCONTRADO = "Producto no encontrado";
    private static final String EMPRENDIMIENTO_NO_ENCONTRADO = "Emprendimiento no encontrado";

    private final CategoriaRepository categoriaRepository;
    private final ProductoServicioRepository productoServicioRepository;
    private final EmprendimientoRepository emprendimientoRepository;
    private final UsuarioRepository usuarioRepository;

    public CatalogoServicioImpl(CategoriaRepository categoriaRepository,
                                 ProductoServicioRepository productoServicioRepository,
                                 EmprendimientoRepository emprendimientoRepository,
                                 UsuarioRepository usuarioRepository) {
        this.categoriaRepository = categoriaRepository;
        this.productoServicioRepository = productoServicioRepository;
        this.emprendimientoRepository = emprendimientoRepository;
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    public List<CategoriaResponse> listarCategorias() {
        return categoriaRepository.findAllByOrderByNombreCategoriaAsc()
                .stream()
                .map(c -> {
                    var r = new CategoriaResponse();
                    r.setIdCategoria(c.getIdCategoria());
                    r.setNombreCategoria(c.getNombreCategoria());
                    r.setDescripcion(c.getDescripcion());
                    return r;
                })
                .toList();
    }

    @Override
    public CategoriaResponse crearCategoria(CategoriaRequest solicitud, String correoAdmin) {
        var admin = usuarioRepository.findByCorreoElectronico(correoAdmin)
                .orElseThrow(() -> new AuthExcepcion(USUARIO_NO_ENCONTRADO));

        if (admin.getRol() != Rol.ADMINISTRADOR) {
            throw new AccesoDenegadoExcepcion("Solo los administradores pueden crear categorías");
        }

        var categoria = new Categoria(solicitud.getNombreCategoria(), null);
        categoria = categoriaRepository.save(categoria);

        var response = new CategoriaResponse();
        response.setIdCategoria(categoria.getIdCategoria());
        response.setNombreCategoria(categoria.getNombreCategoria());
        return response;
    }

    @Override
    public CategoriaResponse actualizarCategoria(Long idCategoria, CategoriaRequest solicitud, String correoAdmin) {
        var admin = usuarioRepository.findByCorreoElectronico(correoAdmin)
                .orElseThrow(() -> new AuthExcepcion(USUARIO_NO_ENCONTRADO));

        if (admin.getRol() != Rol.ADMINISTRADOR) {
            throw new AccesoDenegadoExcepcion("Solo los administradores pueden actualizar categorías");
        }

        var categoria = categoriaRepository.findById(idCategoria)
                .orElseThrow(() -> new RecursoNoEncontradoExcepcion("Categoría no encontrada"));

        categoria.setNombreCategoria(solicitud.getNombreCategoria());
        categoria = categoriaRepository.save(categoria);

        var response = new CategoriaResponse();
        response.setIdCategoria(categoria.getIdCategoria());
        response.setNombreCategoria(categoria.getNombreCategoria());
        return response;
    }

    @Override
    public ProductoResponse crearProducto(Long idEmprendimiento, ProductoRequest solicitud,
                                           String correoUsuario) {
        var usuario = usuarioRepository.findByCorreoElectronico(correoUsuario)
                .orElseThrow(() -> new AuthExcepcion(USUARIO_NO_ENCONTRADO));

        var emprendimiento = emprendimientoRepository.findById(idEmprendimiento)
                .orElseThrow(() -> new RecursoNoEncontradoExcepcion(EMPRENDIMIENTO_NO_ENCONTRADO));

        if (!emprendimiento.getUsuario().getIdUsuario().equals(usuario.getIdUsuario())) {
            throw new AccesoDenegadoExcepcion("No eres el dueño de este emprendimiento");
        }

        var categoria = categoriaRepository.findById(solicitud.getIdCategoria())
                .orElseThrow(() -> new RecursoNoEncontradoExcepcion("Categoría no encontrada"));

        var producto = productoServicioRepository.save(new com.market.market.entities.ProductoServicio(
                emprendimiento, categoria, solicitud.getNombre(), solicitud.getDescripcion(),
                solicitud.getPrecio(), solicitud.getStockDisponible(),
                solicitud.getImagenUrl(), true
        ));

        return construirResponse(producto);
    }

    @Override
    public Page<ProductoResponse> buscarProductos(String nombre, Long idCategoria,
                                                   BigDecimal precioMin, BigDecimal precioMax,
                                                   int pagina, int tamanio) {
        var paginacion = PageRequest.of(pagina, tamanio, Sort.by("nombre").ascending());

        var paginaProductos = productoServicioRepository.buscarConFiltros(
                nombre, idCategoria, precioMin, precioMax, paginacion);

        return paginaProductos.map(this::construirResponse);
    }

    @Override
    public List<ProductoResponse> listarProductosPorEmprendimiento(Long idEmprendimiento) {
        var emprendimiento = emprendimientoRepository.findById(idEmprendimiento)
                .orElseThrow(() -> new RecursoNoEncontradoExcepcion(EMPRENDIMIENTO_NO_ENCONTRADO));

        return emprendimiento.getProductosServicios().stream()
                .filter(p -> Boolean.TRUE.equals(p.getEstadoPublicacion()))
                .map(this::construirResponse)
                .toList();
    }

    @Override
    public ProductoResponse actualizarProducto(Long idProducto, ProductoRequest solicitud,
                                                String correoUsuario) {
        var producto = productoServicioRepository.findById(idProducto)
                .orElseThrow(() -> new RecursoNoEncontradoExcepcion(PRODUCTO_NO_ENCONTRADO));

        verificarPropietario(producto.getEmprendimiento().getIdEmprendimiento(), correoUsuario);

        var categoria = categoriaRepository.findById(solicitud.getIdCategoria())
                .orElseThrow(() -> new RecursoNoEncontradoExcepcion("Categoría no encontrada"));

        producto.setNombre(solicitud.getNombre());
        producto.setDescripcion(solicitud.getDescripcion());
        producto.setPrecio(solicitud.getPrecio());
        producto.setStockDisponible(solicitud.getStockDisponible());
        producto.setImagenUrl(solicitud.getImagenUrl());
        producto.setCategoria(categoria);

        producto = productoServicioRepository.save(producto);
        return construirResponse(producto);
    }

    @Override
    public void eliminarProducto(Long idProducto, String correoUsuario) {
        var producto = productoServicioRepository.findById(idProducto)
                .orElseThrow(() -> new RecursoNoEncontradoExcepcion(PRODUCTO_NO_ENCONTRADO));

        verificarPropietario(producto.getEmprendimiento().getIdEmprendimiento(), correoUsuario);

        producto.setEstadoPublicacion(false);
        productoServicioRepository.save(producto);
    }

    @Override
    public void eliminarCategoria(Long idCategoria, String correoAdmin) {
        var admin = usuarioRepository.findByCorreoElectronico(correoAdmin)
                .orElseThrow(() -> new AuthExcepcion(USUARIO_NO_ENCONTRADO));

        if (admin.getRol() != Rol.ADMINISTRADOR) {
            throw new AccesoDenegadoExcepcion("Solo los administradores pueden eliminar categorías");
        }

        var categoria = categoriaRepository.findById(idCategoria)
                .orElseThrow(() -> new RecursoNoEncontradoExcepcion("Categoría no encontrada"));

        categoriaRepository.delete(categoria);
    }

    private void verificarPropietario(Long idEmprendimiento, String correoUsuario) {
        var usuario = usuarioRepository.findByCorreoElectronico(correoUsuario)
                .orElseThrow(() -> new AuthExcepcion(USUARIO_NO_ENCONTRADO));

        var emprendimiento = emprendimientoRepository.findById(idEmprendimiento)
                .orElseThrow(() -> new RecursoNoEncontradoExcepcion(EMPRENDIMIENTO_NO_ENCONTRADO));

        if (!emprendimiento.getUsuario().getIdUsuario().equals(usuario.getIdUsuario())) {
            throw new AccesoDenegadoExcepcion("No tienes permiso para modificar este producto");
        }
    }

    private ProductoResponse construirResponse(com.market.market.entities.ProductoServicio p) {
        var r = new ProductoResponse();
        r.setIdProducto(p.getIdProducto());
        r.setNombre(p.getNombre());
        r.setDescripcion(p.getDescripcion());
        r.setPrecio(p.getPrecio());
        r.setStockDisponible(p.getStockDisponible());
        r.setImagenUrl(p.getImagenUrl());
        r.setEstadoPublicacion(Boolean.TRUE.equals(p.getEstadoPublicacion()));
        r.setIdCategoria(p.getCategoria().getIdCategoria());
        r.setNombreCategoria(p.getCategoria().getNombreCategoria());
        r.setIdEmprendimiento(p.getEmprendimiento().getIdEmprendimiento());
        r.setNombreEmprendimiento(p.getEmprendimiento().getNombreNegocio());
        return r;
    }
}
