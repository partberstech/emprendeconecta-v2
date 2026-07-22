package com.market.market.services;

import com.market.market.dto.CalificacionRequest;
import com.market.market.dto.CalificacionResumenResponse;

public interface CalificacionServicio {

    CalificacionResumenResponse calificar(Long idEmprendimiento, CalificacionRequest solicitud, String correoCliente);

    CalificacionResumenResponse listarPorEmprendimiento(Long idEmprendimiento);
}
