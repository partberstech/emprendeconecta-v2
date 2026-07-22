package com.market.market.services;

import com.market.market.dto.CategoriaRequest;
import com.market.market.dto.CategoriaResponse;
import com.market.market.dto.ProductoRequest;
import com.market.market.dto.ProductoResponse;
import org.springframework.data.domain.Page;

import java.math.BigDecimal;
import java.util.List;

public interface CatalogoServicio {

    List<CategoriaResponse> listarCategorias();

    CategoriaResponse crearCategoria(CategoriaRequest solicitud, String correoAdmin);

    CategoriaResponse actualizarCategoria(Long idCategoria, CategoriaRequest solicitud, String correoAdmin);

    ProductoResponse crearProducto(Long idEmprendimiento, ProductoRequest solicitud, String correoUsuario);

    Page<ProductoResponse> buscarProductos(String nombre, Long idCategoria,
                                            BigDecimal precioMin, BigDecimal precioMax,
                                            int pagina, int tamanio);

    Page<ProductoResponse> buscarProductosPorTexto(String termino, int pagina, int tamanio);

    List<ProductoResponse> listarProductosPorEmprendimiento(Long idEmprendimiento);

    ProductoResponse actualizarProducto(Long idProducto, ProductoRequest solicitud, String correoUsuario);

    void eliminarProducto(Long idProducto, String correoUsuario);

    void eliminarCategoria(Long idCategoria, String correoAdmin);
}
