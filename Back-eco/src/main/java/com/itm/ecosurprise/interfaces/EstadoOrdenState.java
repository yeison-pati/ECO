package com.itm.ecosurprise.interfaces;

import com.itm.ecosurprise.models.Orden;


/**
 * Interfaz que define los métodos para los estados de una orden.
 * Cada estado de la orden implementará esta interfaz para definir su comportamiento específico.
 */
public interface EstadoOrdenState {
    void confirmar(Orden orden);
    void cancelar(Orden orden);
    void reembolsar(Orden orden);
}

