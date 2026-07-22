package com.market.market.controladores;

import com.market.market.dto.CategoriaRequest;
import com.market.market.dto.CategoriaResponse;
import com.market.market.services.CatalogoServicio;
import jakarta.validation.Valid;
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
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/categorias")
public class CategoriaController {

    private final CatalogoServicio catalogoServicio;

    public CategoriaController(CatalogoServicio catalogoServicio) {
        this.catalogoServicio = catalogoServicio;
    }

    @GetMapping
    public ResponseEntity<List<CategoriaResponse>> listarCategorias() {
        var respuesta = catalogoServicio.listarCategorias();
        return ResponseEntity.ok(respuesta);
    }

    @PostMapping
    public ResponseEntity<CategoriaResponse> crearCategoria(
            @Valid @RequestBody CategoriaRequest solicitud,
            Authentication autenticacion) {
        var respuesta = catalogoServicio.crearCategoria(solicitud, autenticacion.getName());
        return ResponseEntity.status(HttpStatus.CREATED).body(respuesta);
    }

    @PutMapping("/{idCategoria}")
    public ResponseEntity<CategoriaResponse> actualizarCategoria(
            @PathVariable Long idCategoria,
            @Valid @RequestBody CategoriaRequest solicitud,
            Authentication autenticacion) {
        var respuesta = catalogoServicio.actualizarCategoria(idCategoria, solicitud, autenticacion.getName());
        return ResponseEntity.ok(respuesta);
    }

    @DeleteMapping("/{idCategoria}")
    public ResponseEntity<Void> eliminarCategoria(
            @PathVariable Long idCategoria,
            Authentication autenticacion) {
        catalogoServicio.eliminarCategoria(idCategoria, autenticacion.getName());
        return ResponseEntity.noContent().build();
    }
}
