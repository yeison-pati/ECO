package com.itm.ecosurprise.classes;

import com.itm.ecosurprise.interfaces.EstadoOrdenState;
import com.itm.ecosurprise.models.Orden;

/**
 * Clase que representa el estado "confirmada" de una orden.
 * Implementa la interfaz EstadoOrdenState.
 * Define el comportamiento específico para una orden que ha sido confirmada.
 */
public class EstadoReembolsada implements EstadoOrdenState {

    @Override
    public void confirmar(Orden orden) {
        throw new UnsupportedOperationException("No se puede confirmar una orden reembolsada.");
    }

    @Override
    public void cancelar(Orden orden) {
        throw new UnsupportedOperationException("La orden ya fue reembolsada.");
    }

    @Override
    public void reembolsar(Orden orden) {
        throw new UnsupportedOperationException("La orden ya está reembolsada.");
    }
}

