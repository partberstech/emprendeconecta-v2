package com.market.market.dto;

import java.util.List;

public class CalificacionResumenResponse {

    private double promedio;
    private long total;
    private List<CalificacionResponse> calificaciones;

    public CalificacionResumenResponse() {}

    public double getPromedio() { return promedio; }
    public void setPromedio(double promedio) { this.promedio = promedio; }

    public long getTotal() { return total; }
    public void setTotal(long total) { this.total = total; }

    public List<CalificacionResponse> getCalificaciones() { return calificaciones; }
    public void setCalificaciones(List<CalificacionResponse> calificaciones) { this.calificaciones = calificaciones; }
}
