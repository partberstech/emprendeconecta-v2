package com.market.market.services;

import com.market.market.dto.CuponValidarRequest;
import com.market.market.dto.CuponValidarResponse;
import com.market.market.exceptions.RecursoNoEncontradoExcepcion;
import com.market.market.repositories.CuponRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class CuponServicioImpl implements CuponServicio {

    private final CuponRepository cuponRepository;

    public CuponServicioImpl(CuponRepository cuponRepository) {
        this.cuponRepository = cuponRepository;
    }

    @Override
    public CuponValidarResponse validar(CuponValidarRequest solicitud) {
        var cupon = cuponRepository.findByCodigo(solicitud.getCodigo())
                .orElseThrow(() -> new RecursoNoEncontradoExcepcion("Cupón no encontrado"));

        if (!cupon.getActivo()) {
            throw new RecursoNoEncontradoExcepcion("El cupón no está activo");
        }

        if (cupon.getFechaExpiracion().isBefore(LocalDateTime.now())) {
            throw new RecursoNoEncontradoExcepcion("El cupón ha expirado");
        }

        if (cupon.getUsosMaximos() != null && cupon.getUsosActuales() >= cupon.getUsosMaximos()) {
            throw new RecursoNoEncontradoExcepcion("El cupón ha alcanzado su límite de usos");
        }

        var response = new CuponValidarResponse();
        response.setId(cupon.getIdCupon());
        response.setCodigo(cupon.getCodigo());
        response.setTipoDescuento(cupon.getTipoDescuento().name().toLowerCase());
        response.setValorDescuento(cupon.getValorDescuento());
        return response;
    }
}
