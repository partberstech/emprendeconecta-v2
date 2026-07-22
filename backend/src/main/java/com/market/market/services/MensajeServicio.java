package com.market.market.services;

import com.market.market.dto.ConversacionResponse;
import com.market.market.dto.MensajeRequest;
import com.market.market.dto.MensajeResponse;

import java.util.List;

public interface MensajeServicio {

    MensajeResponse enviar(MensajeRequest solicitud, String correoRemitente);

    List<ConversacionResponse> listarConversaciones(String correoUsuario);

    List<MensajeResponse> obtenerHistorial(Long idUsuarioDestino, String correoUsuario);
}
