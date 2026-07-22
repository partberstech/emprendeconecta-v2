package com.market.market.services;

import com.market.market.dto.DetallePedidoResponse;
import com.market.market.dto.EstadoPedidoRequest;
import com.market.market.dto.PedidoRequest;
import com.market.market.dto.PedidoResponse;
import com.market.market.entities.Cupon;
import com.market.market.entities.DetallePedido;
import com.market.market.entities.EstadoPedido;
import com.market.market.entities.Pedido;
import com.market.market.entities.TipoDescuento;
import com.market.market.exceptions.AccesoDenegadoExcepcion;
import com.market.market.exceptions.AuthExcepcion;
import com.market.market.exceptions.RecursoNoEncontradoExcepcion;
import com.market.market.repositories.CuponRepository;
import com.market.market.repositories.EmprendimientoRepository;
import com.market.market.repositories.PedidoRepository;
import com.market.market.repositories.ProductoServicioRepository;
import com.market.market.repositories.UsuarioRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;

@Service
public class PedidoServicioImpl implements PedidoServicio {

    private static final String USUARIO_NO_ENCONTRADO = "Usuario no encontrado";
    private static final String PEDIDO_NO_ENCONTRADO = "Pedido no encontrado";
    private static final String EMPRENDIMIENTO_NO_ENCONTRADO = "Emprendimiento no encontrado";
    private static final String PRODUCTO_NO_ENCONTRADO = "Producto no encontrado";
    private static final String STOCK_INSUFICIENTE = "Stock insuficiente para el producto: ";

    private final PedidoRepository pedidoRepository;
    private final UsuarioRepository usuarioRepository;
    private final EmprendimientoRepository emprendimientoRepository;
    private final ProductoServicioRepository productoServicioRepository;
    private final CuponRepository cuponRepository;

    public PedidoServicioImpl(PedidoRepository pedidoRepository,
                               UsuarioRepository usuarioRepository,
                               EmprendimientoRepository emprendimientoRepository,
                               ProductoServicioRepository productoServicioRepository,
                               CuponRepository cuponRepository) {
        this.pedidoRepository = pedidoRepository;
        this.usuarioRepository = usuarioRepository;
        this.emprendimientoRepository = emprendimientoRepository;
        this.productoServicioRepository = productoServicioRepository;
        this.cuponRepository = cuponRepository;
    }

    @Override
    @Transactional
    public PedidoResponse crear(PedidoRequest solicitud, String correoCliente) {
        var cliente = usuarioRepository.findByCorreoElectronico(correoCliente)
                .orElseThrow(() -> new AuthExcepcion(USUARIO_NO_ENCONTRADO));

        var emprendimiento = emprendimientoRepository.findById(solicitud.getIdEmprendimiento())
                .orElseThrow(() -> new RecursoNoEncontradoExcepcion(EMPRENDIMIENTO_NO_ENCONTRADO));

        var total = BigDecimal.ZERO;
        var detalles = new ArrayList<DetallePedido>();

        for (var item : solicitud.getDetalles()) {
            var producto = productoServicioRepository.findById(item.getIdProducto())
                    .orElseThrow(() -> new RecursoNoEncontradoExcepcion(PRODUCTO_NO_ENCONTRADO + ": " + item.getIdProducto()));

            if (producto.getStockDisponible() < item.getCantidad()) {
                throw new AuthExcepcion(STOCK_INSUFICIENTE + producto.getNombre());
            }

            var precioUnitario = producto.getPrecio();
            var subtotal = precioUnitario.multiply(BigDecimal.valueOf(item.getCantidad()));
            total = total.add(subtotal);

            var detalle = new DetallePedido(null, producto, item.getCantidad(), precioUnitario, subtotal);
            detalles.add(detalle);

            producto.setStockDisponible(producto.getStockDisponible() - item.getCantidad());
            productoServicioRepository.save(producto);
        }

        Cupon cupon = null;
        if (solicitud.getIdCupon() != null) {
            cupon = cuponRepository.findById(solicitud.getIdCupon())
                    .orElseThrow(() -> new RecursoNoEncontradoExcepcion("Cupón no encontrado"));

            if (!cupon.getActivo()) {
                throw new AuthExcepcion("El cupón no está activo");
            }
            if (cupon.getFechaExpiracion().isBefore(java.time.LocalDateTime.now())) {
                throw new AuthExcepcion("El cupón ha expirado");
            }
            if (cupon.getMontoMinimo() != null && total.compareTo(cupon.getMontoMinimo()) < 0) {
                throw new AuthExcepcion("El pedido no alcanza el monto mínimo para usar este cupón");
            }
            if (cupon.getUsosMaximos() != null && cupon.getUsosActuales() >= cupon.getUsosMaximos()) {
                throw new AuthExcepcion("El cupón ha alcanzado su límite de usos");
            }

            if (cupon.getTipoDescuento() == TipoDescuento.PORCENTAJE) {
                var descuento = total.multiply(cupon.getValorDescuento())
                        .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
                total = total.subtract(descuento);
            } else {
                total = total.subtract(cupon.getValorDescuento());
                if (total.compareTo(BigDecimal.ZERO) < 0) {
                    total = BigDecimal.ZERO;
                }
            }

            cupon.setUsosActuales(cupon.getUsosActuales() + 1);
            cuponRepository.save(cupon);
        }

        var pedido = new Pedido(cliente, emprendimiento, total, solicitud.getMetodoPago(), EstadoPedido.RECIBIDO, cupon);

        for (var detalle : detalles) {
            pedido.getDetalles().add(detalle);
            detalle.setPedido(pedido);
        }

        pedido = pedidoRepository.save(pedido);
        return construirResponse(pedido);
    }

    @Override
    public Page<PedidoResponse> listarMisCompras(String correoCliente, int pagina, int tamanio) {
        var cliente = usuarioRepository.findByCorreoElectronico(correoCliente)
                .orElseThrow(() -> new AuthExcepcion(USUARIO_NO_ENCONTRADO));

        var paginacion = PageRequest.of(pagina, tamanio, Sort.by("fechaPedido").descending());
        return pedidoRepository.findByClienteIdUsuario(cliente.getIdUsuario(), paginacion)
                .map(this::construirResponse);
    }

    @Override
    public Page<PedidoResponse> listarPedidosPorEmprendimiento(Long idEmprendimiento, String correoUsuario,
                                                                 int pagina, int tamanio) {
        var emprendimiento = emprendimientoRepository.findById(idEmprendimiento)
                .orElseThrow(() -> new RecursoNoEncontradoExcepcion(EMPRENDIMIENTO_NO_ENCONTRADO));

        var usuario = usuarioRepository.findByCorreoElectronico(correoUsuario)
                .orElseThrow(() -> new AuthExcepcion(USUARIO_NO_ENCONTRADO));

        if (!emprendimiento.getUsuario().getIdUsuario().equals(usuario.getIdUsuario())) {
            throw new AccesoDenegadoExcepcion("No eres el dueño de este emprendimiento");
        }

        var paginacion = PageRequest.of(pagina, tamanio, Sort.by("fechaPedido").descending());
        return pedidoRepository.findByEmprendimientoIdEmprendimiento(idEmprendimiento, paginacion)
                .map(this::construirResponse);
    }

    @Override
    public PedidoResponse actualizarEstado(Long idPedido, EstadoPedidoRequest solicitud, String correoUsuario) {
        var pedido = pedidoRepository.findById(idPedido)
                .orElseThrow(() -> new RecursoNoEncontradoExcepcion(PEDIDO_NO_ENCONTRADO));

        var usuario = usuarioRepository.findByCorreoElectronico(correoUsuario)
                .orElseThrow(() -> new AuthExcepcion(USUARIO_NO_ENCONTRADO));

        if (!pedido.getEmprendimiento().getUsuario().getIdUsuario().equals(usuario.getIdUsuario())) {
            throw new AccesoDenegadoExcepcion("No eres el dueño de este emprendimiento");
        }

        pedido.setEstadoPedido(solicitud.getEstado());
        pedido = pedidoRepository.save(pedido);
        return construirResponse(pedido);
    }

    private PedidoResponse construirResponse(Pedido pedido) {
        var r = new PedidoResponse();
        r.setIdPedido(pedido.getIdPedido());
        r.setFechaPedido(pedido.getFechaPedido());
        r.setTotal(pedido.getTotal());
        r.setMetodoPago(pedido.getMetodoPago());
        r.setEstadoPedido(pedido.getEstadoPedido());
        r.setIdCliente(pedido.getCliente().getIdUsuario());
        r.setNombreCliente(pedido.getCliente().getNombreCompleto());
        r.setIdEmprendimiento(pedido.getEmprendimiento().getIdEmprendimiento());
        r.setNombreEmprendimiento(pedido.getEmprendimiento().getNombreNegocio());
        if (pedido.getCupon() != null) {
            r.setIdCupon(pedido.getCupon().getIdCupon());
            r.setCodigoCupon(pedido.getCupon().getCodigo());
        }
        r.setDetalles(pedido.getDetalles().stream()
                .map(this::construirDetalleResponse)
                .toList());
        return r;
    }

    private DetallePedidoResponse construirDetalleResponse(DetallePedido detalle) {
        var r = new DetallePedidoResponse();
        r.setIdDetalle(detalle.getIdDetalle());
        r.setIdProducto(detalle.getProductoServicio().getIdProducto());
        r.setNombreProducto(detalle.getProductoServicio().getNombre());
        r.setImagenUrl(detalle.getProductoServicio().getImagenUrl());
        r.setCantidad(detalle.getCantidad());
        r.setPrecioUnitario(detalle.getPrecioUnitario());
        r.setSubtotal(detalle.getSubtotal());
        return r;
    }
}
