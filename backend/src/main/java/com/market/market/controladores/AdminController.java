package com.market.market.controladores;

import com.market.market.dto.AdminCalificacionResponse;
import com.market.market.dto.AdminCuponRequest;
import com.market.market.dto.AdminCuponResponse;
import com.market.market.dto.AdminEmprendimientoResponse;
import com.market.market.dto.AdminEmprendimientoUpdateRequest;
import com.market.market.dto.AdminProductoResponse;
import com.market.market.dto.AdminReporteResponse;
import com.market.market.dto.AdminUsuarioResponse;
import com.market.market.services.AdminServicio;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin")
public class AdminController {

    private final AdminServicio adminServicio;

    public AdminController(AdminServicio adminServicio) {
        this.adminServicio = adminServicio;
    }

    @GetMapping("/usuarios")
    public ResponseEntity<Map<String, List<AdminUsuarioResponse>>> listarUsuarios(
            @RequestParam(required = false) String rol,
            Authentication autenticacion) {
        var respuesta = adminServicio.listarUsuarios(autenticacion.getName(), rol);
        return ResponseEntity.ok(Map.of("data", respuesta));
    }

    @GetMapping("/productos")
    public ResponseEntity<Map<String, List<AdminProductoResponse>>> listarProductos(
            @RequestParam(required = false) Boolean publicado,
            Authentication autenticacion) {
        var respuesta = adminServicio.listarProductos(autenticacion.getName(), publicado);
        return ResponseEntity.ok(Map.of("data", respuesta));
    }

    @DeleteMapping("/productos/{idProducto}")
    public ResponseEntity<Void> eliminarProducto(
            @PathVariable Long idProducto,
            Authentication autenticacion) {
        adminServicio.eliminarProducto(idProducto, autenticacion.getName());
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/calificaciones")
    public ResponseEntity<Map<String, List<AdminCalificacionResponse>>> listarCalificaciones(
            @RequestParam(required = false) Long emprendimientoId,
            @RequestParam(required = false) Integer puntuacionMin,
            Authentication autenticacion) {
        var respuesta = adminServicio.listarCalificaciones(autenticacion.getName(), emprendimientoId, puntuacionMin);
        return ResponseEntity.ok(Map.of("data", respuesta));
    }

    @DeleteMapping("/calificaciones/{idCalificacion}")
    public ResponseEntity<Void> eliminarCalificacion(
            @PathVariable Long idCalificacion,
            Authentication autenticacion) {
        adminServicio.eliminarCalificacion(idCalificacion, autenticacion.getName());
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/reportes")
    public ResponseEntity<AdminReporteResponse> obtenerReporte(Authentication autenticacion) {
        var respuesta = adminServicio.obtenerReporte(autenticacion.getName());
        return ResponseEntity.ok(respuesta);
    }

    @GetMapping("/emprendimientos")
    public ResponseEntity<Map<String, List<AdminEmprendimientoResponse>>> listarEmprendimientos(
            @RequestParam(required = false) String estado,
            Authentication autenticacion) {
        var respuesta = adminServicio.listarEmprendimientos(autenticacion.getName(), estado);
        return ResponseEntity.ok(Map.of("data", respuesta));
    }

    @PatchMapping("/emprendimientos/{idEmprendimiento}")
    public ResponseEntity<Void> actualizarEstadoEmprendimiento(
            @PathVariable Long idEmprendimiento,
            @Valid @RequestBody AdminEmprendimientoUpdateRequest solicitud,
            Authentication autenticacion) {
        adminServicio.actualizarEstadoEmprendimiento(idEmprendimiento, solicitud, autenticacion.getName());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/cupones")
    public ResponseEntity<Map<String, List<AdminCuponResponse>>> listarCupones(Authentication autenticacion) {
        var respuesta = adminServicio.listarCupones(autenticacion.getName());
        return ResponseEntity.ok(Map.of("data", respuesta));
    }

    @PostMapping("/cupones")
    public ResponseEntity<AdminCuponResponse> crearCupon(
            @Valid @RequestBody AdminCuponRequest solicitud,
            Authentication autenticacion) {
        var respuesta = adminServicio.crearCupon(solicitud, autenticacion.getName());
        return ResponseEntity.status(HttpStatus.CREATED).body(respuesta);
    }

    @PutMapping("/cupones/{idCupon}")
    public ResponseEntity<AdminCuponResponse> actualizarCupon(
            @PathVariable Long idCupon,
            @Valid @RequestBody AdminCuponRequest solicitud,
            Authentication autenticacion) {
        var respuesta = adminServicio.actualizarCupon(idCupon, solicitud, autenticacion.getName());
        return ResponseEntity.ok(respuesta);
    }

    @DeleteMapping("/cupones/{idCupon}")
    public ResponseEntity<Void> eliminarCupon(
            @PathVariable Long idCupon,
            Authentication autenticacion) {
        adminServicio.eliminarCupon(idCupon, autenticacion.getName());
        return ResponseEntity.noContent().build();
    }
}
