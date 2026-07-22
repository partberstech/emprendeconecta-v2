package com.market.market.services;

import com.market.market.dto.EmprendimientoCercanoResponse;
import com.market.market.dto.EmprendimientoEstadisticasResponse;
import com.market.market.dto.EmprendimientoRequest;
import com.market.market.dto.EmprendimientoResumenResponse;
import com.market.market.dto.EmprendimientoResponse;
import com.market.market.entities.Emprendimiento;
import com.market.market.entities.EstadoPedido;
import com.market.market.entities.EstadoValidacion;
import com.market.market.entities.Rol;
import com.market.market.exceptions.AccesoDenegadoExcepcion;
import com.market.market.exceptions.AuthExcepcion;
import com.market.market.exceptions.RecursoNoEncontradoExcepcion;
import com.market.market.repositories.EmprendimientoRepository;
import com.market.market.repositories.PedidoRepository;
import com.market.market.repositories.ProductoServicioRepository;
import com.market.market.repositories.UsuarioRepository;
import com.market.market.utils.FechaUtil;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class EmprendimientoServicioImpl implements EmprendimientoServicio {

    private static final String USUARIO_NO_ENCONTRADO = "Usuario no encontrado";
    private static final String EMPRENDIMIENTO_NO_ENCONTRADO = "Emprendimiento no encontrado";

    private final EmprendimientoRepository emprendimientoRepository;
    private final UsuarioRepository usuarioRepository;
    private final ProductoServicioRepository productoServicioRepository;
    private final PedidoRepository pedidoRepository;

    public EmprendimientoServicioImpl(EmprendimientoRepository emprendimientoRepository,
                                       UsuarioRepository usuarioRepository,
                                       ProductoServicioRepository productoServicioRepository,
                                       PedidoRepository pedidoRepository) {
        this.emprendimientoRepository = emprendimientoRepository;
        this.usuarioRepository = usuarioRepository;
        this.productoServicioRepository = productoServicioRepository;
        this.pedidoRepository = pedidoRepository;
    }

    @Override
    public EmprendimientoResponse crear(EmprendimientoRequest solicitud, String correoUsuario) {
        var usuario = usuarioRepository.findByCorreoElectronico(correoUsuario)
                .orElseThrow(() -> new AuthExcepcion(USUARIO_NO_ENCONTRADO));

        if (usuario.getRol() != Rol.EMPRENDEDOR) {
            throw new AccesoDenegadoExcepcion("Solo los emprendedores pueden crear perfiles comerciales");
        }

        var emprendimiento = new Emprendimiento(
                usuario,
                solicitud.getNombreNegocio(),
                solicitud.getDireccionFisica(),
                EstadoValidacion.PENDIENTE
        );
        emprendimiento.setDescripcion(solicitud.getDescripcion());
        emprendimiento.setLatitud(solicitud.getLatitud());
        emprendimiento.setLongitud(solicitud.getLongitud());
        emprendimiento.setLogoUrl(solicitud.getLogoUrl());

        emprendimiento = emprendimientoRepository.save(emprendimiento);
        return construirResponse(emprendimiento);
    }

    @Override
    public Page<EmprendimientoResumenResponse> listarActivos(String busqueda, int pagina, int tamanio) {
        var paginacion = PageRequest.of(pagina, tamanio, Sort.by("nombreNegocio").ascending());

        Page<Emprendimiento> resultados;
        if (busqueda == null || busqueda.isBlank()) {
            resultados = emprendimientoRepository
                    .findByEstadoValidacion(EstadoValidacion.APROBADO, paginacion);
        } else {
            resultados = emprendimientoRepository
                    .findByEstadoValidacionAndNombreNegocioContainingIgnoreCase(
                            EstadoValidacion.APROBADO, busqueda, paginacion);
        }

        return resultados.map(this::construirResumenResponse);
    }

    @Override
    public EmprendimientoResponse obtenerDetalle(Long idEmprendimiento) {
        var emprendimiento = emprendimientoRepository
                .findByIdEmprendimientoAndEstadoValidacion(idEmprendimiento, EstadoValidacion.APROBADO)
                .orElseThrow(() -> new RecursoNoEncontradoExcepcion(EMPRENDIMIENTO_NO_ENCONTRADO));

        return construirResponse(emprendimiento);
    }

    @Override
    public EmprendimientoResponse actualizar(Long idEmprendimiento, EmprendimientoRequest solicitud,
                                              String correoUsuario) {
        var emprendimiento = emprendimientoRepository.findById(idEmprendimiento)
                .orElseThrow(() -> new RecursoNoEncontradoExcepcion(EMPRENDIMIENTO_NO_ENCONTRADO));

        var usuario = usuarioRepository.findByCorreoElectronico(correoUsuario)
                .orElseThrow(() -> new AuthExcepcion(USUARIO_NO_ENCONTRADO));

        if (!emprendimiento.getUsuario().getIdUsuario().equals(usuario.getIdUsuario())) {
            throw new AccesoDenegadoExcepcion("No tienes permiso para modificar este emprendimiento");
        }

        emprendimiento.setNombreNegocio(solicitud.getNombreNegocio());
        emprendimiento.setDescripcion(solicitud.getDescripcion());
        emprendimiento.setDireccionFisica(solicitud.getDireccionFisica());
        emprendimiento.setLatitud(solicitud.getLatitud());
        emprendimiento.setLongitud(solicitud.getLongitud());
        emprendimiento.setLogoUrl(solicitud.getLogoUrl());

        emprendimiento = emprendimientoRepository.save(emprendimiento);
        return construirResponse(emprendimiento);
    }

    @Override
    public List<EmprendimientoCercanoResponse> obtenerCercanos(double latitud, double longitud, double radio) {
        var resultados = emprendimientoRepository.encontrarIdsCercanos(latitud, longitud, radio);

        var idsConDistancia = resultados.stream()
                .collect(Collectors.toMap(
                        r -> (Long) r[0],
                        r -> ((Double) r[1])
                ));

        var emprendimientos = emprendimientoRepository.findAllById(idsConDistancia.keySet());

        var mapaEmprendimientos = emprendimientos.stream()
                .collect(Collectors.toMap(Emprendimiento::getIdEmprendimiento, e -> e));

        return idsConDistancia.keySet().stream()
                .map(id -> {
                    var emp = mapaEmprendimientos.get(id);
                    if (emp == null) return null;
                    var resp = new EmprendimientoCercanoResponse();
                    resp.setIdEmprendimiento(emp.getIdEmprendimiento());
                    resp.setNombreNegocio(emp.getNombreNegocio());
                    resp.setDireccionFisica(emp.getDireccionFisica());
                    resp.setLogoUrl(emp.getLogoUrl());
                    resp.setLatitud(emp.getLatitud());
                    resp.setLongitud(emp.getLongitud());
                    resp.setNombreUsuario(emp.getUsuario().getNombreCompleto());
                    resp.setDistanciaKm(Math.round(idsConDistancia.get(id) * 100.0) / 100.0);
                    return resp;
                })
                .filter(e -> e != null)
                .toList();
    }

    @Override
    public EmprendimientoEstadisticasResponse obtenerEstadisticas(Long idEmprendimiento, String correoUsuario) {
        var usuario = usuarioRepository.findByCorreoElectronico(correoUsuario)
                .orElseThrow(() -> new AuthExcepcion(USUARIO_NO_ENCONTRADO));

        var emprendimiento = emprendimientoRepository.findById(idEmprendimiento)
                .orElseThrow(() -> new RecursoNoEncontradoExcepcion(EMPRENDIMIENTO_NO_ENCONTRADO));

        if (!emprendimiento.getUsuario().getIdUsuario().equals(usuario.getIdUsuario())) {
            throw new AccesoDenegadoExcepcion("No tienes permiso para ver las estadísticas de este emprendimiento");
        }

        var productos = productoServicioRepository
                .findByEmprendimientoIdEmprendimientoAndEstadoPublicacionTrue(idEmprendimiento);
        long totalProductos = productos.size();
        long productosBajoStock = productos.stream()
                .filter(p -> p.getStockDisponible() <= 5)
                .count();

        var ahora = FechaUtil.ahora();
        var inicioDia = ahora.withHour(0).withMinute(0).withSecond(0).withNano(0);

        long pedidosPendientes = pedidoRepository
                .countByEmprendimientoIdEmprendimientoAndEstadoPedido(idEmprendimiento, EstadoPedido.RECIBIDO);

        Map<String, Long> pedidosPorEstado = new HashMap<>();
        pedidosPorEstado.put("pendiente", pedidosPendientes);
        pedidosPorEstado.put("confirmado", 0L);
        pedidosPorEstado.put("en_proceso", pedidoRepository
                .countByEmprendimientoIdEmprendimientoAndEstadoPedido(idEmprendimiento, EstadoPedido.EN_PROCESO));
        pedidosPorEstado.put("enviado", pedidoRepository
                .countByEmprendimientoIdEmprendimientoAndEstadoPedido(idEmprendimiento, EstadoPedido.ENVIADO));
        pedidosPorEstado.put("entregado", pedidoRepository
                .countByEmprendimientoIdEmprendimientoAndEstadoPedido(idEmprendimiento, EstadoPedido.ENTREGADO));

        var ventasTotales = pedidoRepository
                .sumTotalByEmprendimientoIdEmprendimientoAndEstadoPedido(idEmprendimiento, EstadoPedido.ENTREGADO);

        var ventasHoy = pedidoRepository
                .sumTotalByEmprendimientoIdEmprendimientoAndFechaPedidoBetween(idEmprendimiento, inicioDia, ahora);

        long totalClientes = pedidoRepository
                .countDistinctClienteByEmprendimientoIdEmprendimiento(idEmprendimiento);

        var response = new EmprendimientoEstadisticasResponse();
        response.setVisitasHoy(0);
        response.setVentasHoy(ventasHoy);
        response.setTotalProductos(totalProductos);
        response.setPedidosPendientes(pedidosPendientes);
        response.setVentasTotales(ventasTotales);
        response.setPedidosPorEstado(pedidosPorEstado);
        response.setProductosBajoStock(productosBajoStock);
        response.setTotalClientes(totalClientes);

        return response;
    }

    private EmprendimientoResponse construirResponse(Emprendimiento emp) {
        var response = new EmprendimientoResponse();
        response.setIdEmprendimiento(emp.getIdEmprendimiento());
        response.setNombreNegocio(emp.getNombreNegocio());
        response.setDescripcion(emp.getDescripcion());
        response.setDireccionFisica(emp.getDireccionFisica());
        response.setLatitud(emp.getLatitud());
        response.setLongitud(emp.getLongitud());
        response.setLogoUrl(emp.getLogoUrl());
        response.setEstadoValidacion(emp.getEstadoValidacion().name());
        response.setNombreUsuario(emp.getUsuario().getNombreCompleto());
        response.setIdUsuario(emp.getUsuario().getIdUsuario());
        return response;
    }

    private EmprendimientoResumenResponse construirResumenResponse(Emprendimiento emp) {
        var response = new EmprendimientoResumenResponse();
        response.setIdEmprendimiento(emp.getIdEmprendimiento());
        response.setNombreNegocio(emp.getNombreNegocio());
        response.setDireccionFisica(emp.getDireccionFisica());
        response.setLogoUrl(emp.getLogoUrl());
        response.setLatitud(emp.getLatitud());
        response.setLongitud(emp.getLongitud());
        response.setNombreUsuario(emp.getUsuario().getNombreCompleto());
        return response;
    }
}
