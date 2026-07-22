package com.market.market.services;

import com.market.market.dto.EstadoPedidoRequest;
import com.market.market.dto.PedidoRequest;
import com.market.market.dto.PedidoResponse;
import org.springframework.data.domain.Page;

public interface PedidoServicio {

    PedidoResponse crear(PedidoRequest solicitud, String correoCliente);

    Page<PedidoResponse> listarMisCompras(String correoCliente, int pagina, int tamanio);

    Page<PedidoResponse> listarPedidosPorEmprendimiento(Long idEmprendimiento, String correoUsuario, int pagina, int tamanio);

    PedidoResponse actualizarEstado(Long idPedido, EstadoPedidoRequest solicitud, String correoUsuario);
}
