package com.itm.ecosurprise.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.itm.ecosurprise.models.Pago;
import com.itm.ecosurprise.repositories.IPago;

@Service
public class PagoService {

    @Autowired
    private IPago pagoRepository;

    /**
     * Crea un nuevo pago y lo guarda en el repositorio.
     *
     * @param pago El objeto de tipo Pago a crear.
     * @return El objeto Pago creado y guardado en la base de datos.
     */
    public Pago crear(Pago pago) {
        return pagoRepository.save(pago);
    }

    /**
     * Obtiene un pago por su ID.
     *
     * @param idPago El ID del pago que se desea obtener.
     * @return El objeto Pago encontrado.
     * @throws RuntimeException Si no se encuentra un pago con el ID proporcionado.
     */
    public Pago obtenerXID(int idPago) {
        return pagoRepository.findById(idPago)
            .orElseThrow(() -> new RuntimeException("Pago no encontrado con ID: " + idPago));
    }

    /**
     * Actualiza la información de un pago existente.
     *
     * @param pago El objeto Pago con los nuevos valores a actualizar.
     * @return El objeto Pago actualizado.
     * @throws RuntimeException Si no se encuentra el pago con el ID proporcionado.
     */
    public Pago actualizar(Pago pago) {
        Pago pagoExistente = pagoRepository.findById(pago.getIdPago())
            .orElseThrow(() -> new RuntimeException("Pago no encontrado con ID: " + pago.getIdPago()));
        pagoExistente.setEstadoPago(pago.getEstadoPago());
        pagoExistente.setMontoPagado(pago.getMontoPagado());
        return pagoRepository.save(pago);
    }

    /**
     * Elimina un pago por su ID.
     *
     * @param id El ID del pago a eliminar.
     * @return Un mensaje indicando que la eliminación fue exitosa.
     */
    public String eliminar(int id) {
        pagoRepository.deleteById(id);
        return "Pago eliminado con éxito";
    }
}
