package com.market.market.services;

import com.market.market.dto.EmprendimientoCercanoResponse;
import com.market.market.dto.EmprendimientoEstadisticasResponse;
import com.market.market.dto.EmprendimientoRequest;
import com.market.market.dto.EmprendimientoResumenResponse;
import com.market.market.dto.EmprendimientoResponse;
import org.springframework.data.domain.Page;

import java.util.List;

public interface EmprendimientoServicio {

    EmprendimientoResponse crear(EmprendimientoRequest solicitud, String correoUsuario);

    Page<EmprendimientoResumenResponse> listarActivos(String busqueda, int pagina, int tamanio);

    EmprendimientoResponse obtenerDetalle(Long idEmprendimiento);

    EmprendimientoResponse actualizar(Long idEmprendimiento, EmprendimientoRequest solicitud, String correoUsuario);

    List<EmprendimientoCercanoResponse> obtenerCercanos(double latitud, double longitud, double radio);

    EmprendimientoEstadisticasResponse obtenerEstadisticas(Long idEmprendimiento, String correoUsuario);
}
