import { API } from '../api/axiosConfig';

export default async function axiosConfirmarOrden(idComerciante, idOrden) {
    try {
        const response = await API.comerciante.confirmarOrden(idComerciante, idOrden);
        return response.data;
    } catch (error) {
        console.error('Error al confirmar la orden:', error);
        throw new Error('Error al confirmar la orden: ' + error.message);
    }
}