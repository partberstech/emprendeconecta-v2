package com.market.market.controladores;

import com.market.market.dto.CategoriaRequest;
import com.market.market.dto.CategoriaResponse;
import com.market.market.dto.ProductoRequest;
import com.market.market.dto.ProductoResponse;
import com.market.market.dto.MensajeResponse;
import com.market.market.services.CatalogoServicio;
import com.market.market.seguridad.JwtUtil;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/v1")
public class CatalogoControlador {

    private final CatalogoServicio catalogoServicio;
    private final JwtUtil jwtUtil;

    public CatalogoControlador(CatalogoServicio catalogoServicio, JwtUtil jwtUtil) {
        this.catalogoServicio = catalogoServicio;
        this.jwtUtil = jwtUtil;
    }

    // -- Categorías --

    @GetMapping("/categorias")
    public ResponseEntity<List<CategoriaResponse>> listarCategorias() {
        return ResponseEntity.ok(catalogoServicio.listarCategorias());
    }

    @PostMapping("/admin/categorias")
    public ResponseEntity<CategoriaResponse> crearCategoria(
            @RequestHeader("Authorization") String token,
            @Valid @RequestBody CategoriaRequest solicitud) {
        var correo = extraerCorreo(token);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(catalogoServicio.crearCategoria(solicitud, correo));
    }

    @PutMapping("/admin/categorias/{id}")
    public ResponseEntity<CategoriaResponse> actualizarCategoria(
            @RequestHeader("Authorization") String token,
            @PathVariable Long id,
            @Valid @RequestBody CategoriaRequest solicitud) {
        var correo = extraerCorreo(token);
        return ResponseEntity.ok(catalogoServicio.actualizarCategoria(id, solicitud, correo));
    }

    @DeleteMapping("/admin/categorias/{id}")
    public ResponseEntity<MensajeResponse> eliminarCategoria(
            @RequestHeader("Authorization") String token,
            @PathVariable Long id) {
        var correo = extraerCorreo(token);
        catalogoServicio.eliminarCategoria(id, correo);
        return ResponseEntity.ok(new MensajeResponse("Categoría eliminada"));
    }

    // -- Productos --

    @GetMapping("/productos")
    public ResponseEntity<Page<ProductoResponse>> buscarProductos(
            @RequestParam(required = false) String nombre,
            @RequestParam(required = false) Long idCategoria,
            @RequestParam(required = false) BigDecimal precioMin,
            @RequestParam(required = false) BigDecimal precioMax,
            @RequestParam(defaultValue = "0") int pagina,
            @RequestParam(defaultValue = "20") int tamanio) {
        return ResponseEntity.ok(
                catalogoServicio.buscarProductos(nombre, idCategoria, precioMin, precioMax, pagina, tamanio));
    }

    @GetMapping("/productos/buscar")
    public ResponseEntity<Page<ProductoResponse>> buscarProductosPorTexto(
            @RequestParam String q,
            @RequestParam(defaultValue = "0") int pagina,
            @RequestParam(defaultValue = "20") int tamanio) {
        return ResponseEntity.ok(
                catalogoServicio.buscarProductosPorTexto(q, pagina, tamanio));
    }

    @GetMapping("/emprendimientos/{idEmprendimiento}/productos")
    public ResponseEntity<List<ProductoResponse>> listarProductosPorEmprendimiento(
            @PathVariable Long idEmprendimiento) {
        return ResponseEntity.ok(
                catalogoServicio.listarProductosPorEmprendimiento(idEmprendimiento));
    }

    @PostMapping("/emprendimientos/{idEmprendimiento}/productos")
    public ResponseEntity<ProductoResponse> crearProducto(
            @RequestHeader("Authorization") String token,
            @PathVariable Long idEmprendimiento,
            @Valid @RequestBody ProductoRequest solicitud) {
        var correo = extraerCorreo(token);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(catalogoServicio.crearProducto(idEmprendimiento, solicitud, correo));
    }

    @PutMapping("/productos/{idProducto}")
    public ResponseEntity<ProductoResponse> actualizarProducto(
            @RequestHeader("Authorization") String token,
            @PathVariable Long idProducto,
            @Valid @RequestBody ProductoRequest solicitud) {
        var correo = extraerCorreo(token);
        return ResponseEntity.ok(catalogoServicio.actualizarProducto(idProducto, solicitud, correo));
    }

    @DeleteMapping("/productos/{idProducto}")
    public ResponseEntity<MensajeResponse> eliminarProducto(
            @RequestHeader("Authorization") String token,
            @PathVariable Long idProducto) {
        var correo = extraerCorreo(token);
        catalogoServicio.eliminarProducto(idProducto, correo);
        return ResponseEntity.ok(new MensajeResponse("Producto desactivado"));
    }

    private String extraerCorreo(String token) {
        return jwtUtil.extraerCorreo(token.replace("Bearer ", ""));
    }
}
