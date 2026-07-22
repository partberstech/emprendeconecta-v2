package com.market.market.controladores;

import com.market.market.dto.EmprendimientoCercanoResponse;
import com.market.market.dto.EmprendimientoEstadisticasResponse;
import com.market.market.dto.EmprendimientoRequest;
import com.market.market.dto.EmprendimientoResumenResponse;
import com.market.market.dto.EmprendimientoResponse;
import com.market.market.services.EmprendimientoServicio;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/emprendimientos")
public class EmprendimientoController {

    private final EmprendimientoServicio emprendimientoServicio;

    public EmprendimientoController(EmprendimientoServicio emprendimientoServicio) {
        this.emprendimientoServicio = emprendimientoServicio;
    }

    @PostMapping
    public ResponseEntity<EmprendimientoResponse> crear(
            @Valid @RequestBody EmprendimientoRequest solicitud,
            Authentication autenticacion) {
        var respuesta = emprendimientoServicio.crear(solicitud, autenticacion.getName());
        return ResponseEntity.status(HttpStatus.CREATED).body(respuesta);
    }

    @GetMapping
    public ResponseEntity<Page<EmprendimientoResumenResponse>> listarActivos(
            @RequestParam(required = false) String busqueda,
            @RequestParam(defaultValue = "0") int pagina,
            @RequestParam(defaultValue = "10") int tamanio) {
        var respuesta = emprendimientoServicio.listarActivos(busqueda, pagina, tamanio);
        return ResponseEntity.ok(respuesta);
    }

    @GetMapping("/{idEmprendimiento}")
    public ResponseEntity<EmprendimientoResponse> obtenerDetalle(
            @PathVariable Long idEmprendimiento) {
        var respuesta = emprendimientoServicio.obtenerDetalle(idEmprendimiento);
        return ResponseEntity.ok(respuesta);
    }

    @PutMapping("/{idEmprendimiento}")
    public ResponseEntity<EmprendimientoResponse> actualizar(
            @PathVariable Long idEmprendimiento,
            @Valid @RequestBody EmprendimientoRequest solicitud,
            Authentication autenticacion) {
        var respuesta = emprendimientoServicio.actualizar(
                idEmprendimiento, solicitud, autenticacion.getName());
        return ResponseEntity.ok(respuesta);
    }

    @GetMapping("/{idEmprendimiento}/estadisticas")
    public ResponseEntity<EmprendimientoEstadisticasResponse> obtenerEstadisticas(
            @PathVariable Long idEmprendimiento,
            Authentication autenticacion) {
        var respuesta = emprendimientoServicio.obtenerEstadisticas(idEmprendimiento, autenticacion.getName());
        return ResponseEntity.ok(respuesta);
    }

    @GetMapping("/cercanos")
    public ResponseEntity<List<EmprendimientoCercanoResponse>> obtenerCercanos(
            @RequestParam double latitud,
            @RequestParam double longitud,
            @RequestParam(defaultValue = "10") double radio) {
        var respuesta = emprendimientoServicio.obtenerCercanos(latitud, longitud, radio);
        return ResponseEntity.ok(respuesta);
    }
}
