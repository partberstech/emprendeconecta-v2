package com.market.market.dto;

public class EmprendimientoCercanoResponse extends EmprendimientoResumenResponse {

    private double distanciaKm;

    public EmprendimientoCercanoResponse() {}

    public double getDistanciaKm() { return distanciaKm; }
    public void setDistanciaKm(double distanciaKm) { this.distanciaKm = distanciaKm; }
}
