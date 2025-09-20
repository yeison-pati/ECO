package com.itm.ecosurprise.classes;

import com.itm.ecosurprise.enums.EstadoOrden;
import com.itm.ecosurprise.interfaces.EstadoOrdenState;
import com.itm.ecosurprise.models.Orden;


/**
 * Clase que representa el estado "Confirmada" de una orden.
 * Implementa la interfaz EstadoOrdenState.
 * Define el comportamiento específico para una orden que ha sido confirmada.
 */
public class EstadoConfirmada implements EstadoOrdenState {
    @Override
    public void confirmar(Orden orden) {
        throw new UnsupportedOperationException("La orden ya está confirmada.");
    }

    @Override
    public void cancelar(Orden orden) {
        orden.setEstadoOrden(EstadoOrden.CANCELADA.name());
    }

    @Override
    public void reembolsar(Orden orden) {
        orden.setEstadoOrden(EstadoOrden.REEMBOLSADA.name());
    }
}
