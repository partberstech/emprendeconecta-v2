package com.market.market.utils;

import java.time.Clock;
import java.time.LocalDateTime;
import java.time.ZoneId;

public class FechaUtil {

    private static final ZoneId ZONA_SANTIAGO = ZoneId.of("America/Santiago");

    private FechaUtil() {}

    public static LocalDateTime ahora() {
        return LocalDateTime.now(Clock.system(ZONA_SANTIAGO));
    }
}
