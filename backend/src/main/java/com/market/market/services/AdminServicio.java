package com.market.market.services;

import com.market.market.dto.AdminCalificacionResponse;
import com.market.market.dto.AdminCuponRequest;
import com.market.market.dto.AdminCuponResponse;
import com.market.market.dto.AdminEmprendimientoResponse;
import com.market.market.dto.AdminEmprendimientoUpdateRequest;
import com.market.market.dto.AdminProductoResponse;
import com.market.market.dto.AdminReporteResponse;
import com.market.market.dto.AdminUsuarioResponse;

import java.util.List;

public interface AdminServicio {

    List<AdminUsuarioResponse> listarUsuarios(String correoAdmin, String rol);

    List<AdminProductoResponse> listarProductos(String correoAdmin, Boolean publicado);

    void eliminarProducto(Long idProducto, String correoAdmin);

    List<AdminCalificacionResponse> listarCalificaciones(String correoAdmin, Long emprendimientoId, Integer puntuacionMin);

    void eliminarCalificacion(Long idCalificacion, String correoAdmin);

    AdminReporteResponse obtenerReporte(String correoAdmin);

    List<AdminEmprendimientoResponse> listarEmprendimientos(String correoAdmin, String estado);

    void actualizarEstadoEmprendimiento(Long idEmprendimiento, AdminEmprendimientoUpdateRequest solicitud, String correoAdmin);

    List<AdminCuponResponse> listarCupones(String correoAdmin);

    AdminCuponResponse crearCupon(AdminCuponRequest solicitud, String correoAdmin);

    AdminCuponResponse actualizarCupon(Long id, AdminCuponRequest solicitud, String correoAdmin);

    void eliminarCupon(Long id, String correoAdmin);
}
