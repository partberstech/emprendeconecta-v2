package com.market.market.services;

import com.market.market.dto.AdminCalificacionResponse;
import com.market.market.dto.AdminCuponRequest;
import com.market.market.dto.AdminCuponResponse;
import com.market.market.dto.AdminEmprendimientoResponse;
import com.market.market.dto.AdminEmprendimientoUpdateRequest;
import com.market.market.dto.AdminPedidoResumenResponse;
import com.market.market.dto.AdminProductoResponse;
import com.market.market.dto.AdminReporteResponse;
import com.market.market.dto.AdminUsuarioResumenResponse;
import com.market.market.dto.AdminUsuarioResponse;
import com.market.market.entities.Cupon;
import com.market.market.entities.Emprendimiento;
import com.market.market.entities.EstadoPedido;
import com.market.market.entities.EstadoValidacion;
import com.market.market.entities.Rol;
import com.market.market.entities.TipoDescuento;
import com.market.market.entities.Usuario;
import com.market.market.exceptions.AccesoDenegadoExcepcion;
import com.market.market.exceptions.AuthExcepcion;
import com.market.market.exceptions.RecursoNoEncontradoExcepcion;
import com.market.market.repositories.CalificacionRepository;
import com.market.market.repositories.CuponRepository;
import com.market.market.repositories.EmprendimientoRepository;
import com.market.market.repositories.MensajeRepository;
import com.market.market.repositories.PedidoRepository;
import com.market.market.repositories.ProductoServicioRepository;
import com.market.market.repositories.UsuarioRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AdminServicioImpl implements AdminServicio {

    private final UsuarioRepository usuarioRepository;
    private final ProductoServicioRepository productoServicioRepository;
    private final CalificacionRepository calificacionRepository;
    private final EmprendimientoRepository emprendimientoRepository;
    private final PedidoRepository pedidoRepository;
    private final MensajeRepository mensajeRepository;
    private final CuponRepository cuponRepository;

    public AdminServicioImpl(UsuarioRepository usuarioRepository,
                              ProductoServicioRepository productoServicioRepository,
                              CalificacionRepository calificacionRepository,
                              EmprendimientoRepository emprendimientoRepository,
                              PedidoRepository pedidoRepository,
                              MensajeRepository mensajeRepository,
                              CuponRepository cuponRepository) {
        this.usuarioRepository = usuarioRepository;
        this.productoServicioRepository = productoServicioRepository;
        this.calificacionRepository = calificacionRepository;
        this.emprendimientoRepository = emprendimientoRepository;
        this.pedidoRepository = pedidoRepository;
        this.mensajeRepository = mensajeRepository;
        this.cuponRepository = cuponRepository;
    }

    @Override
    public List<AdminUsuarioResponse> listarUsuarios(String correoAdmin, String rol) {
        var admin = usuarioRepository.findByCorreoElectronico(correoAdmin)
                .orElseThrow(() -> new AuthExcepcion("Usuario no encontrado"));

        if (admin.getRol() != Rol.ADMINISTRADOR) {
            throw new AccesoDenegadoExcepcion("Solo los administradores pueden acceder a este recurso");
        }

        List<Usuario> usuarios;
        if (rol != null && !rol.isBlank()) {
            var rolEnum = Rol.valueOf(rol.toUpperCase());
            usuarios = usuarioRepository.findByRol(rolEnum);
        } else {
            usuarios = usuarioRepository.findAll();
        }

        return usuarios.stream().map(this::construirResponse).toList();
    }

    @Override
    public List<AdminProductoResponse> listarProductos(String correoAdmin, Boolean publicado) {
        var admin = usuarioRepository.findByCorreoElectronico(correoAdmin)
                .orElseThrow(() -> new AuthExcepcion("Usuario no encontrado"));

        if (admin.getRol() != Rol.ADMINISTRADOR) {
            throw new AccesoDenegadoExcepcion("Solo los administradores pueden acceder a este recurso");
        }

        List<com.market.market.entities.ProductoServicio> productos;
        if (publicado != null) {
            productos = productoServicioRepository.findByEstadoPublicacion(publicado);
        } else {
            productos = productoServicioRepository.findAll();
        }

        return productos.stream().map(this::construirProductoResponse).toList();
    }

    @Override
    public void eliminarProducto(Long idProducto, String correoAdmin) {
        var admin = usuarioRepository.findByCorreoElectronico(correoAdmin)
                .orElseThrow(() -> new AuthExcepcion("Usuario no encontrado"));

        if (admin.getRol() != Rol.ADMINISTRADOR) {
            throw new AccesoDenegadoExcepcion("Solo los administradores pueden eliminar productos");
        }

        var producto = productoServicioRepository.findById(idProducto)
                .orElseThrow(() -> new RecursoNoEncontradoExcepcion("Producto no encontrado"));

        producto.setEstadoPublicacion(false);
        productoServicioRepository.save(producto);
    }

    @Override
    public List<AdminCalificacionResponse> listarCalificaciones(String correoAdmin, Long emprendimientoId, Integer puntuacionMin) {
        var admin = usuarioRepository.findByCorreoElectronico(correoAdmin)
                .orElseThrow(() -> new AuthExcepcion("Usuario no encontrado"));

        if (admin.getRol() != Rol.ADMINISTRADOR) {
            throw new AccesoDenegadoExcepcion("Solo los administradores pueden acceder a este recurso");
        }

        return calificacionRepository.filtrar(emprendimientoId, puntuacionMin)
                .stream()
                .map(this::construirCalificacionResponse)
                .toList();
    }

    @Override
    public void eliminarCalificacion(Long idCalificacion, String correoAdmin) {
        var admin = usuarioRepository.findByCorreoElectronico(correoAdmin)
                .orElseThrow(() -> new AuthExcepcion("Usuario no encontrado"));

        if (admin.getRol() != Rol.ADMINISTRADOR) {
            throw new AccesoDenegadoExcepcion("Solo los administradores pueden eliminar calificaciones");
        }

        var calificacion = calificacionRepository.findById(idCalificacion)
                .orElseThrow(() -> new RecursoNoEncontradoExcepcion("Calificación no encontrada"));

        calificacionRepository.delete(calificacion);
    }

    @Override
    public AdminReporteResponse obtenerReporte(String correoAdmin) {
        var admin = usuarioRepository.findByCorreoElectronico(correoAdmin)
                .orElseThrow(() -> new AuthExcepcion("Usuario no encontrado"));

        if (admin.getRol() != Rol.ADMINISTRADOR) {
            throw new AccesoDenegadoExcepcion("Solo los administradores pueden acceder a este recurso");
        }

        long totalUsuarios = usuarioRepository.count();
        long totalEmprendedores = usuarioRepository.findByRol(Rol.EMPRENDEDOR).size();
        long totalClientes = usuarioRepository.findByRol(Rol.CLIENTE).size();
        long totalEmprendimientos = emprendimientoRepository.count();
        long totalProductos = productoServicioRepository.count();
        long totalPedidos = pedidoRepository.count();
        long totalMensajes = mensajeRepository.count();
        long totalCalificaciones = calificacionRepository.count();

        Map<String, Long> pedidosPorEstado = new HashMap<>();
        pedidosPorEstado.put("pendiente", pedidoRepository.countByEstadoPedido(EstadoPedido.RECIBIDO));
        pedidosPorEstado.put("confirmado", 0L);
        pedidosPorEstado.put("en_proceso", pedidoRepository.countByEstadoPedido(EstadoPedido.EN_PROCESO));
        pedidosPorEstado.put("enviado", pedidoRepository.countByEstadoPedido(EstadoPedido.ENVIADO));
        pedidosPorEstado.put("entregado", pedidoRepository.countByEstadoPedido(EstadoPedido.ENTREGADO));

        var ventasTotales = pedidoRepository.sumTotalVentas();

        var ultimosPedidos = pedidoRepository
                .findAll(PageRequest.of(0, 10, Sort.by("fechaPedido").descending()))
                .stream()
                .map(p -> {
                    var r = new AdminPedidoResumenResponse();
                    r.setId(p.getIdPedido());
                    r.setCliente(p.getCliente().getNombreCompleto());
                    r.setEmprendimiento(p.getEmprendimiento().getNombreNegocio());
                    r.setTotal(p.getTotal());
                    r.setEstado(p.getEstadoPedido().name());
                    r.setFecha(p.getFechaPedido());
                    return r;
                })
                .toList();

        var ultimosRegistros = usuarioRepository
                .findAll(PageRequest.of(0, 10, Sort.by("fechaRegistro").descending()))
                .stream()
                .map(u -> {
                    var r = new AdminUsuarioResumenResponse();
                    r.setId(u.getIdUsuario());
                    r.setNombre(u.getNombreCompleto());
                    r.setCorreo(u.getCorreoElectronico());
                    r.setRol(u.getRol().name());
                    r.setFechaRegistro(u.getFechaRegistro());
                    return r;
                })
                .toList();

        var response = new AdminReporteResponse();
        response.setTotalUsuarios(totalUsuarios);
        response.setTotalEmprendedores(totalEmprendedores);
        response.setTotalClientes(totalClientes);
        response.setTotalEmprendimientos(totalEmprendimientos);
        response.setTotalProductos(totalProductos);
        response.setTotalPedidos(totalPedidos);
        response.setTotalMensajes(totalMensajes);
        response.setTotalCalificaciones(totalCalificaciones);
        response.setPedidosPorEstado(pedidosPorEstado);
        response.setVentasTotales(ventasTotales);
        response.setUltimosPedidos(ultimosPedidos);
        response.setUltimosRegistros(ultimosRegistros);

        return response;
    }

    @Override
    public List<AdminEmprendimientoResponse> listarEmprendimientos(String correoAdmin, String estado) {
        var admin = usuarioRepository.findByCorreoElectronico(correoAdmin)
                .orElseThrow(() -> new AuthExcepcion("Usuario no encontrado"));

        if (admin.getRol() != Rol.ADMINISTRADOR) {
            throw new AccesoDenegadoExcepcion("Solo los administradores pueden acceder a este recurso");
        }

        List<Emprendimiento> emprendimientos;
        if (estado != null && !estado.isBlank()) {
            var estadoEnum = EstadoValidacion.valueOf(estado.toUpperCase());
            emprendimientos = emprendimientoRepository.findByEstadoValidacion(estadoEnum);
        } else {
            emprendimientos = emprendimientoRepository.findAll();
        }

        return emprendimientos.stream().map(this::construirEmprendimientoResponse).toList();
    }

    @Override
    public void actualizarEstadoEmprendimiento(Long idEmprendimiento, AdminEmprendimientoUpdateRequest solicitud, String correoAdmin) {
        var admin = usuarioRepository.findByCorreoElectronico(correoAdmin)
                .orElseThrow(() -> new AuthExcepcion("Usuario no encontrado"));

        if (admin.getRol() != Rol.ADMINISTRADOR) {
            throw new AccesoDenegadoExcepcion("Solo los administradores pueden modificar emprendimientos");
        }

        var emprendimiento = emprendimientoRepository.findById(idEmprendimiento)
                .orElseThrow(() -> new RecursoNoEncontradoExcepcion("Emprendimiento no encontrado"));

        var estado = EstadoValidacion.valueOf(solicitud.getEstadoValidacion().toUpperCase());
        emprendimiento.setEstadoValidacion(estado);
        emprendimientoRepository.save(emprendimiento);
    }

    private AdminEmprendimientoResponse construirEmprendimientoResponse(Emprendimiento emp) {
        var response = new AdminEmprendimientoResponse();
        response.setIdEmprendimiento(emp.getIdEmprendimiento());
        response.setNombreNegocio(emp.getNombreNegocio());
        response.setDescripcion(emp.getDescripcion());
        response.setDireccionFisica(emp.getDireccionFisica());
        response.setEstadoValidacion(emp.getEstadoValidacion().name().toLowerCase());
        response.setNombreEmprendedor(emp.getUsuario().getNombreCompleto());
        response.setCorreoEmprendedor(emp.getUsuario().getCorreoElectronico());
        response.setIdEmprendedor(emp.getUsuario().getIdUsuario());
        response.setTelefonoEmprendedor(emp.getUsuario().getTelefono());
        return response;
    }

    @Override
    public List<AdminCuponResponse> listarCupones(String correoAdmin) {
        var admin = usuarioRepository.findByCorreoElectronico(correoAdmin)
                .orElseThrow(() -> new AuthExcepcion("Usuario no encontrado"));

        if (admin.getRol() != Rol.ADMINISTRADOR) {
            throw new AccesoDenegadoExcepcion("Solo los administradores pueden acceder a este recurso");
        }

        return cuponRepository.findAll().stream().map(this::construirCuponResponse).toList();
    }

    @Override
    public AdminCuponResponse crearCupon(AdminCuponRequest solicitud, String correoAdmin) {
        var admin = usuarioRepository.findByCorreoElectronico(correoAdmin)
                .orElseThrow(() -> new AuthExcepcion("Usuario no encontrado"));

        if (admin.getRol() != Rol.ADMINISTRADOR) {
            throw new AccesoDenegadoExcepcion("Solo los administradores pueden crear cupones");
        }

        var cupon = new Cupon();
        cupon.setCodigo(solicitud.getCodigo());
        cupon.setTipoDescuento(TipoDescuento.valueOf(solicitud.getTipoDescuento().toUpperCase()));
        cupon.setValorDescuento(solicitud.getValorDescuento());
        cupon.setMontoMinimo(solicitud.getMontoMinimo());
        cupon.setUsosMaximos(solicitud.getUsosMaximos());
        cupon.setFechaExpiracion(solicitud.getFechaExpiracion());
        cupon.setActivo(true);

        cupon = cuponRepository.save(cupon);
        return construirCuponResponse(cupon);
    }

    @Override
    public AdminCuponResponse actualizarCupon(Long id, AdminCuponRequest solicitud, String correoAdmin) {
        var admin = usuarioRepository.findByCorreoElectronico(correoAdmin)
                .orElseThrow(() -> new AuthExcepcion("Usuario no encontrado"));

        if (admin.getRol() != Rol.ADMINISTRADOR) {
            throw new AccesoDenegadoExcepcion("Solo los administradores pueden modificar cupones");
        }

        var cupon = cuponRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoExcepcion("Cupón no encontrado"));

        cupon.setCodigo(solicitud.getCodigo());
        cupon.setTipoDescuento(TipoDescuento.valueOf(solicitud.getTipoDescuento().toUpperCase()));
        cupon.setValorDescuento(solicitud.getValorDescuento());
        cupon.setMontoMinimo(solicitud.getMontoMinimo());
        cupon.setUsosMaximos(solicitud.getUsosMaximos());
        cupon.setFechaExpiracion(solicitud.getFechaExpiracion());

        cupon = cuponRepository.save(cupon);
        return construirCuponResponse(cupon);
    }

    @Override
    public void eliminarCupon(Long id, String correoAdmin) {
        var admin = usuarioRepository.findByCorreoElectronico(correoAdmin)
                .orElseThrow(() -> new AuthExcepcion("Usuario no encontrado"));

        if (admin.getRol() != Rol.ADMINISTRADOR) {
            throw new AccesoDenegadoExcepcion("Solo los administradores pueden eliminar cupones");
        }

        var cupon = cuponRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoExcepcion("Cupón no encontrado"));

        cuponRepository.delete(cupon);
    }

    private AdminCuponResponse construirCuponResponse(Cupon cupon) {
        var r = new AdminCuponResponse();
        r.setId(cupon.getIdCupon());
        r.setCodigo(cupon.getCodigo());
        r.setTipoDescuento(cupon.getTipoDescuento().name().toLowerCase());
        r.setValorDescuento(cupon.getValorDescuento());
        r.setMontoMinimo(cupon.getMontoMinimo());
        r.setUsosMaximos(cupon.getUsosMaximos());
        r.setUsosActuales(cupon.getUsosActuales());
        r.setFechaExpiracion(cupon.getFechaExpiracion());
        r.setActivo(cupon.getActivo());
        r.setFechaCreacion(cupon.getFechaCreacion());
        return r;
    }

    private AdminCalificacionResponse construirCalificacionResponse(com.market.market.entities.Calificacion c) {
        var response = new AdminCalificacionResponse();
        response.setId(c.getIdCalificacion());
        response.setPuntuacion(c.getPuntuacion());
        response.setComentario(c.getComentario());
        response.setFecha(c.getFechaCalificacion());
        response.setEmprendimientoId(c.getEmprendimiento().getIdEmprendimiento());
        response.setUsuarioId(c.getCliente().getIdUsuario());
        return response;
    }

    private AdminProductoResponse construirProductoResponse(com.market.market.entities.ProductoServicio p) {
        var response = new AdminProductoResponse();
        response.setId(p.getIdProducto());
        response.setNombre(p.getNombre());
        response.setDescripcion(p.getDescripcion());
        response.setPrecio(p.getPrecio());
        response.setStockDisponible(p.getStockDisponible());
        response.setIdCategoria(p.getCategoria().getIdCategoria());
        response.setEmprendimientoId(p.getEmprendimiento().getIdEmprendimiento());
        response.setActivo(p.getEstadoPublicacion());
        return response;
    }

    private AdminUsuarioResponse construirResponse(Usuario usuario) {
        var response = new AdminUsuarioResponse();
        response.setId(usuario.getIdUsuario());
        response.setNombreCompleto(usuario.getNombreCompleto());
        response.setCorreoElectronico(usuario.getCorreoElectronico());
        response.setTelefono(usuario.getTelefono());
        response.setRol(usuario.getRol().name());
        response.setActivo(usuario.getActivo());
        response.setFechaRegistro(usuario.getFechaRegistro());
        return response;
    }
}
