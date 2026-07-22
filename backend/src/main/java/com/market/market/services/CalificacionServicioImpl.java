package com.market.market.services;

import com.market.market.dto.CalificacionRequest;
import com.market.market.dto.CalificacionResponse;
import com.market.market.dto.CalificacionResumenResponse;
import com.market.market.entities.EstadoPedido;
import com.market.market.exceptions.AuthExcepcion;
import com.market.market.exceptions.RecursoNoEncontradoExcepcion;
import com.market.market.repositories.CalificacionRepository;
import com.market.market.repositories.EmprendimientoRepository;
import com.market.market.repositories.PedidoRepository;
import com.market.market.repositories.UsuarioRepository;
import org.springframework.stereotype.Service;

@Service
public class CalificacionServicioImpl implements CalificacionServicio {

    private static final String USUARIO_NO_ENCONTRADO = "Usuario no encontrado";
    private static final String EMPRENDIMIENTO_NO_ENCONTRADO = "Emprendimiento no encontrado";
    private static final String SIN_PEDIDO_COMPLETADO = "Debes tener un pedido entregado en este emprendimiento para calificar";
    private static final String YA_CALIFICASTE = "Ya has calificado este emprendimiento";

    private final CalificacionRepository calificacionRepository;
    private final UsuarioRepository usuarioRepository;
    private final EmprendimientoRepository emprendimientoRepository;
    private final PedidoRepository pedidoRepository;

    public CalificacionServicioImpl(CalificacionRepository calificacionRepository,
                                     UsuarioRepository usuarioRepository,
                                     EmprendimientoRepository emprendimientoRepository,
                                     PedidoRepository pedidoRepository) {
        this.calificacionRepository = calificacionRepository;
        this.usuarioRepository = usuarioRepository;
        this.emprendimientoRepository = emprendimientoRepository;
        this.pedidoRepository = pedidoRepository;
    }

    @Override
    public CalificacionResumenResponse calificar(Long idEmprendimiento, CalificacionRequest solicitud,
                                                  String correoCliente) {
        var cliente = usuarioRepository.findByCorreoElectronico(correoCliente)
                .orElseThrow(() -> new AuthExcepcion(USUARIO_NO_ENCONTRADO));

        var emprendimiento = emprendimientoRepository.findById(idEmprendimiento)
                .orElseThrow(() -> new RecursoNoEncontradoExcepcion(EMPRENDIMIENTO_NO_ENCONTRADO));

        var tienePedido = pedidoRepository
                .existsByClienteIdUsuarioAndEmprendimientoIdEmprendimientoAndEstadoPedido(
                        cliente.getIdUsuario(), idEmprendimiento, EstadoPedido.ENTREGADO);
        if (!tienePedido) {
            throw new AuthExcepcion(SIN_PEDIDO_COMPLETADO);
        }

        var yaCalifico = calificacionRepository
                .findByClienteIdUsuarioAndEmprendimientoIdEmprendimiento(
                        cliente.getIdUsuario(), idEmprendimiento);
        if (yaCalifico.isPresent()) {
            throw new AuthExcepcion(YA_CALIFICASTE);
        }

        var calificacion = new com.market.market.entities.Calificacion(
                cliente, emprendimiento, solicitud.getPuntuacion(), solicitud.getComentario());
        calificacionRepository.save(calificacion);

        return construirResumen(idEmprendimiento);
    }

    @Override
    public CalificacionResumenResponse listarPorEmprendimiento(Long idEmprendimiento) {
        return construirResumen(idEmprendimiento);
    }

    private CalificacionResumenResponse construirResumen(Long idEmprendimiento) {
        var promedio = calificacionRepository.promedioPorEmprendimiento(idEmprendimiento);
        var total = calificacionRepository.contarPorEmprendimiento(idEmprendimiento);
        var calificaciones = calificacionRepository
                .findByEmprendimientoIdEmprendimientoOrderByFechaCalificacionDesc(idEmprendimiento)
                .stream()
                .map(c -> {
                    var r = new CalificacionResponse();
                    r.setIdCalificacion(c.getIdCalificacion());
                    r.setPuntuacion(c.getPuntuacion());
                    r.setComentario(c.getComentario());
                    r.setFechaCalificacion(c.getFechaCalificacion());
                    r.setIdCliente(c.getCliente().getIdUsuario());
                    r.setNombreCliente(c.getCliente().getNombreCompleto());
                    return r;
                })
                .toList();

        var resumen = new CalificacionResumenResponse();
        resumen.setPromedio(promedio != null ? Math.round(promedio * 10.0) / 10.0 : 0.0);
        resumen.setTotal(total != null ? total : 0L);
        resumen.setCalificaciones(calificaciones);
        return resumen;
    }
}
