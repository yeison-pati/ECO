package com.itm.ecosurprise.classes;

import com.itm.ecosurprise.enums.EstadoOrden;
import com.itm.ecosurprise.interfaces.EstadoOrdenState;
import com.itm.ecosurprise.models.Orden;


/**
 * clase que se encarga de obtener el estado de la orden y devolver la clase correspondiente
 * para que se pueda realizar la acción correspondiente según el estado de la orden.
 */
public class EstadoOrdenFactory {

    public static void inicializarEstadoPendiente(Orden orden) {
        orden.setEstadoOrden(EstadoOrden.PENDIENTE.name());
    }

    public static EstadoOrdenState getEstado(Orden orden) {

        switch (EstadoOrden.valueOf(orden.getEstadoOrden())) {
            case PENDIENTE:
                return new EstadoPendiente();
            case CONFIRMADA:
                return new EstadoConfirmada();
            case CANCELADA:
                return new EstadoCancelada();
            case REEMBOLSADA:
                return new EstadoReembolsada();
            default:
                throw new IllegalArgumentException("Estado desconocido");
        }
    }
}



