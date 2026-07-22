package com.market.market.services;

import com.market.market.dto.CuponValidarRequest;
import com.market.market.dto.CuponValidarResponse;

public interface CuponServicio {

    CuponValidarResponse validar(CuponValidarRequest solicitud);
}
