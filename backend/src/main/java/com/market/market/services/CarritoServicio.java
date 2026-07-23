package com.market.market.services;

import com.market.market.dto.CarritoItemRequest;
import com.market.market.dto.CarritoResponse;

public interface CarritoServicio {

    CarritoResponse obtenerCarrito(String correoUsuario);

    CarritoResponse agregarItem(String correoUsuario, CarritoItemRequest solicitud);

    CarritoResponse actualizarCantidad(String correoUsuario, Long idItem, CarritoItemRequest solicitud);

    void eliminarItem(String correoUsuario, Long idItem);

    void limpiarCarrito(String correoUsuario);
}
