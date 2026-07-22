package com.market.market.controladores;

import com.market.market.dto.ProductoRequest;
import com.market.market.dto.ProductoResponse;
import com.market.market.services.CatalogoServicio;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/v1")
public class ProductoController {

    private final CatalogoServicio catalogoServicio;

    public ProductoController(CatalogoServicio catalogoServicio) {
        this.catalogoServicio = catalogoServicio;
    }

    @PostMapping("/emprendimientos/{idEmprendimiento}/productos")
    public ResponseEntity<ProductoResponse> crearProducto(
            @PathVariable Long idEmprendimiento,
            @Valid @RequestBody ProductoRequest solicitud,
            Authentication autenticacion) {
        var respuesta = catalogoServicio.crearProducto(
                idEmprendimiento, solicitud, autenticacion.getName());
        return ResponseEntity.status(HttpStatus.CREATED).body(respuesta);
    }

    @GetMapping("/productos")
    public ResponseEntity<Page<ProductoResponse>> buscarProductos(
            @RequestParam(required = false) String nombre,
            @RequestParam(required = false) Long idCategoria,
            @RequestParam(required = false) BigDecimal precioMin,
            @RequestParam(required = false) BigDecimal precioMax,
            @RequestParam(defaultValue = "0") int pagina,
            @RequestParam(defaultValue = "10") int tamanio) {
        var respuesta = catalogoServicio.buscarProductos(
                nombre, idCategoria, precioMin, precioMax, pagina, tamanio);
        return ResponseEntity.ok(respuesta);
    }

    @GetMapping("/emprendimientos/{idEmprendimiento}/productos")
    public ResponseEntity<List<ProductoResponse>> listarProductosPorEmprendimiento(
            @PathVariable Long idEmprendimiento) {
        var respuesta = catalogoServicio.listarProductosPorEmprendimiento(idEmprendimiento);
        return ResponseEntity.ok(respuesta);
    }

    @PutMapping("/productos/{idProducto}")
    public ResponseEntity<ProductoResponse> actualizarProducto(
            @PathVariable Long idProducto,
            @Valid @RequestBody ProductoRequest solicitud,
            Authentication autenticacion) {
        var respuesta = catalogoServicio.actualizarProducto(
                idProducto, solicitud, autenticacion.getName());
        return ResponseEntity.ok(respuesta);
    }

    @DeleteMapping("/productos/{idProducto}")
    public ResponseEntity<Void> eliminarProducto(
            @PathVariable Long idProducto,
            Authentication autenticacion) {
        catalogoServicio.eliminarProducto(idProducto, autenticacion.getName());
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/productos/buscar")
    public ResponseEntity<Page<ProductoResponse>> buscarProductosPorTexto(
            @RequestParam String q,
            @RequestParam(defaultValue = "0") int pagina,
            @RequestParam(defaultValue = "10") int tamanio) {
        var respuesta = catalogoServicio.buscarProductosPorTexto(q, pagina, tamanio);
        return ResponseEntity.ok(respuesta);
    }
}
