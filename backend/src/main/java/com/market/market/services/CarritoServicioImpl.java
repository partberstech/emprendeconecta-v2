package com.market.market.services;

import com.market.market.dto.CarritoItemRequest;
import com.market.market.dto.CarritoItemResponse;
import com.market.market.dto.CarritoResponse;
import com.market.market.entities.Carrito;
import com.market.market.entities.CarritoItem;
import com.market.market.entities.ProductoServicio;
import com.market.market.entities.Usuario;
import com.market.market.exceptions.RecursoNoEncontradoExcepcion;
import com.market.market.repositories.CarritoItemRepository;
import com.market.market.repositories.CarritoRepository;
import com.market.market.repositories.ProductoServicioRepository;
import com.market.market.repositories.UsuarioRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.stream.Collectors;

@Service
public class CarritoServicioImpl implements CarritoServicio {

    private static final String USUARIO_NO_ENCONTRADO = "Usuario no encontrado";
    private static final String CARRITO_NO_ENCONTRADO = "Carrito no encontrado";
    private static final String PRODUCTO_NO_ENCONTRADO = "Producto no encontrado";
    private static final String ITEM_NO_ENCONTRADO = "Item del carrito no encontrado";

    private final CarritoRepository carritoRepository;
    private final CarritoItemRepository carritoItemRepository;
    private final ProductoServicioRepository productoServicioRepository;
    private final UsuarioRepository usuarioRepository;

    public CarritoServicioImpl(CarritoRepository carritoRepository,
                                CarritoItemRepository carritoItemRepository,
                                ProductoServicioRepository productoServicioRepository,
                                UsuarioRepository usuarioRepository) {
        this.carritoRepository = carritoRepository;
        this.carritoItemRepository = carritoItemRepository;
        this.productoServicioRepository = productoServicioRepository;
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    public CarritoResponse obtenerCarrito(String correoUsuario) {
        var idUsuario = obtenerIdUsuario(correoUsuario);
        var carrito = carritoRepository.findByIdUsuarioAndEstado(idUsuario, "ACTIVO")
                .orElseGet(() -> crearNuevoCarrito(idUsuario));
        return construirResponse(carrito);
    }

    @Override
    @Transactional
    public CarritoResponse agregarItem(String correoUsuario, CarritoItemRequest solicitud) {
        var idUsuario = obtenerIdUsuario(correoUsuario);
        var producto = productoServicioRepository.findById(solicitud.getIdProducto())
                .orElseThrow(() -> new RecursoNoEncontradoExcepcion(PRODUCTO_NO_ENCONTRADO));

        var carrito = carritoRepository.findByIdUsuarioAndEstado(idUsuario, "ACTIVO")
                .orElseGet(() -> crearNuevoCarrito(idUsuario));

        var itemExistente = carritoItemRepository
                .findByCarritoIdCarritoAndIdProducto(carrito.getIdCarrito(), solicitud.getIdProducto());

        if (itemExistente.isPresent()) {
            var item = itemExistente.get();
            item.setCantidad(item.getCantidad() + solicitud.getCantidad());
            carritoItemRepository.save(item);
        } else {
            var nuevoItem = new CarritoItem(
                    carrito,
                    producto.getIdProducto(),
                    producto.getNombre(),
                    producto.getPrecio(),
                    producto.getImagenUrl(),
                    solicitud.getCantidad()
            );
            carrito.getItems().add(nuevoItem);
            carritoRepository.save(carrito);
        }

        carrito = carritoRepository.findByIdUsuarioAndEstado(idUsuario, "ACTIVO")
                .orElseThrow(() -> new RecursoNoEncontradoExcepcion(CARRITO_NO_ENCONTRADO));
        return construirResponse(carrito);
    }

    @Override
    @Transactional
    public CarritoResponse actualizarCantidad(String correoUsuario, Long idItem, CarritoItemRequest solicitud) {
        var idUsuario = obtenerIdUsuario(correoUsuario);
        var carrito = carritoRepository.findByIdUsuarioAndEstado(idUsuario, "ACTIVO")
                .orElseThrow(() -> new RecursoNoEncontradoExcepcion(CARRITO_NO_ENCONTRADO));

        var item = carrito.getItems().stream()
                .filter(i -> i.getIdItem().equals(idItem))
                .findFirst()
                .orElseThrow(() -> new RecursoNoEncontradoExcepcion(ITEM_NO_ENCONTRADO));

        var cantidad = solicitud.getCantidad();
        if (cantidad <= 0) {
            carrito.getItems().remove(item);
        } else {
            item.setCantidad(cantidad);
        }

        carritoRepository.save(carrito);
        return construirResponse(carrito);
    }

    @Override
    @Transactional
    public void eliminarItem(String correoUsuario, Long idItem) {
        var idUsuario = obtenerIdUsuario(correoUsuario);
        var carrito = carritoRepository.findByIdUsuarioAndEstado(idUsuario, "ACTIVO")
                .orElseThrow(() -> new RecursoNoEncontradoExcepcion(CARRITO_NO_ENCONTRADO));

        var item = carrito.getItems().stream()
                .filter(i -> i.getIdItem().equals(idItem))
                .findFirst()
                .orElseThrow(() -> new RecursoNoEncontradoExcepcion(ITEM_NO_ENCONTRADO));

        carrito.getItems().remove(item);
        carritoRepository.save(carrito);
    }

    @Override
    @Transactional
    public void limpiarCarrito(String correoUsuario) {
        var idUsuario = obtenerIdUsuario(correoUsuario);
        var carrito = carritoRepository.findByIdUsuarioAndEstado(idUsuario, "ACTIVO")
                .orElseThrow(() -> new RecursoNoEncontradoExcepcion(CARRITO_NO_ENCONTRADO));

        carrito.getItems().clear();
        carritoRepository.save(carrito);
    }

    private Long obtenerIdUsuario(String correoUsuario) {
        return usuarioRepository.findByCorreoElectronico(correoUsuario)
                .map(Usuario::getIdUsuario)
                .orElseThrow(() -> new RecursoNoEncontradoExcepcion(USUARIO_NO_ENCONTRADO));
    }

    private Carrito crearNuevoCarrito(Long idUsuario) {
        var carrito = new Carrito(idUsuario);
        return carritoRepository.save(carrito);
    }

    private CarritoResponse construirResponse(Carrito carrito) {
        var response = new CarritoResponse();
        response.setIdCarrito(carrito.getIdCarrito());
        response.setIdUsuario(carrito.getIdUsuario());
        response.setFechaCreacion(carrito.getFechaCreacion());
        response.setEstado(carrito.getEstado());

        var items = carrito.getItems().stream()
                .map(this::construirItemResponse)
                .collect(Collectors.toList());
        response.setItems(items);

        var total = items.stream()
                .map(i -> i.getPrecioUnitario().multiply(BigDecimal.valueOf(i.getCantidad())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        response.setTotal(total);

        return response;
    }

    private CarritoItemResponse construirItemResponse(CarritoItem item) {
        var response = new CarritoItemResponse();
        response.setIdItem(item.getIdItem());
        response.setIdProducto(item.getIdProducto());
        response.setNombreProducto(item.getNombreProducto());
        response.setPrecioUnitario(item.getPrecioUnitario());
        response.setImagenUrl(item.getImagenUrl());
        response.setCantidad(item.getCantidad());
        response.setSubtotal(item.getPrecioUnitario().multiply(BigDecimal.valueOf(item.getCantidad())));
        return response;
    }
}
