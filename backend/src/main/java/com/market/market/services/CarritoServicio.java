package com.market.market.services;

import com.market.market.dto.CarritoItemRequest;
import com.market.market.dto.CarritoResponse;

public interface CarritoServicio {

    CarritoResponse obtenerCarritoActivo(Long idUsuario);

    CarritoResponse agregarItem(Long idUsuario, CarritoItemRequest solicitud);

    CarritoResponse actualizarCantidadItem(Long idUsuario, Long idItem, Integer cantidad);

    void eliminarItem(Long idUsuario, Long idItem);

    void vaciarCarrito(Long idUsuario);
}
