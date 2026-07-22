package com.market.market.services;

import com.market.market.dto.ConversacionResponse;
import com.market.market.dto.MensajeRequest;
import com.market.market.dto.MensajeResponse;
import com.market.market.entities.Mensaje;
import com.market.market.exceptions.AuthExcepcion;
import com.market.market.exceptions.RecursoNoEncontradoExcepcion;
import com.market.market.repositories.MensajeRepository;
import com.market.market.repositories.UsuarioRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Service
public class MensajeServicioImpl implements MensajeServicio {

    private static final String USUARIO_NO_ENCONTRADO = "Usuario no encontrado";

    private final MensajeRepository mensajeRepository;
    private final UsuarioRepository usuarioRepository;

    public MensajeServicioImpl(MensajeRepository mensajeRepository,
                                UsuarioRepository usuarioRepository) {
        this.mensajeRepository = mensajeRepository;
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    public MensajeResponse enviar(MensajeRequest solicitud, String correoRemitente) {
        var remitente = usuarioRepository.findByCorreoElectronico(correoRemitente)
                .orElseThrow(() -> new AuthExcepcion(USUARIO_NO_ENCONTRADO));

        var destinatario = usuarioRepository.findById(solicitud.getIdDestinatario())
                .orElseThrow(() -> new RecursoNoEncontradoExcepcion(USUARIO_NO_ENCONTRADO));

        var mensaje = new Mensaje(remitente, destinatario, solicitud.getContenido(), false);
        mensaje = mensajeRepository.save(mensaje);

        return construirResponse(mensaje);
    }

    @Override
    public List<ConversacionResponse> listarConversaciones(String correoUsuario) {
        var usuario = usuarioRepository.findByCorreoElectronico(correoUsuario)
                .orElseThrow(() -> new AuthExcepcion(USUARIO_NO_ENCONTRADO));

        var idsUsuarios = mensajeRepository.findIdsUsuariosConversacion(usuario.getIdUsuario());

        var conversaciones = new ArrayList<ConversacionResponse>();
        for (var idOtro : idsUsuarios) {
            var otro = usuarioRepository.findById(idOtro)
                    .orElseThrow(() -> new RecursoNoEncontradoExcepcion(USUARIO_NO_ENCONTRADO));

            var ultimosMensajes = mensajeRepository.findUltimoMensaje(
                    usuario.getIdUsuario(), idOtro, PageRequest.of(0, 1));

            var ultimo = ultimosMensajes.isEmpty() ? null : ultimosMensajes.getFirst();
            var noLeidos = mensajeRepository
                    .countByDestinatarioIdUsuarioAndRemitenteIdUsuarioAndLeidoFalse(
                            usuario.getIdUsuario(), idOtro);

            var conv = new ConversacionResponse();
            conv.setIdUsuario(otro.getIdUsuario());
            conv.setNombreCompleto(otro.getNombreCompleto());
            conv.setUltimoMensaje(ultimo != null ? ultimo.getContenido() : null);
            conv.setFechaUltimoMensaje(ultimo != null ? ultimo.getFechaEnvio() : null);
            conv.setNoLeidos(noLeidos);
            conversaciones.add(conv);
        }

        conversaciones.sort(Comparator.comparing(ConversacionResponse::getFechaUltimoMensaje,
                Comparator.nullsLast(Comparator.reverseOrder())));

        return conversaciones;
    }

    @Override
    public List<MensajeResponse> obtenerHistorial(Long idUsuarioDestino, String correoUsuario) {
        var usuario = usuarioRepository.findByCorreoElectronico(correoUsuario)
                .orElseThrow(() -> new AuthExcepcion(USUARIO_NO_ENCONTRADO));

        var mensajes = mensajeRepository.findConversacion(usuario.getIdUsuario(), idUsuarioDestino);

        marcarComoLeidos(usuario.getIdUsuario(), idUsuarioDestino);

        return mensajes.stream()
                .map(this::construirResponse)
                .toList();
    }

    private void marcarComoLeidos(Long idUsuario, Long idOtroUsuario) {
        var noLeidos = mensajeRepository
                .findByLeidoFalseAndDestinatarioIdUsuario(idUsuario).stream()
                .filter(m -> m.getRemitente().getIdUsuario().equals(idOtroUsuario))
                .toList();

        if (!noLeidos.isEmpty()) {
            noLeidos.forEach(m -> m.setLeido(true));
            mensajeRepository.saveAll(noLeidos);
        }
    }

    private MensajeResponse construirResponse(Mensaje m) {
        var r = new MensajeResponse();
        r.setIdMensaje(m.getIdMensaje());
        r.setIdRemitente(m.getRemitente().getIdUsuario());
        r.setNombreRemitente(m.getRemitente().getNombreCompleto());
        r.setIdDestinatario(m.getDestinatario().getIdUsuario());
        r.setNombreDestinatario(m.getDestinatario().getNombreCompleto());
        r.setContenido(m.getContenido());
        r.setFechaEnvio(m.getFechaEnvio());
        r.setLeido(Boolean.TRUE.equals(m.getLeido()));
        return r;
    }
}
