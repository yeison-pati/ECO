



import { API } from '../api/axiosConfig';





const axiosActualizarCantidadProducto = async (idConsumidor, idProducto, cantidad) => {
    try {
        const response = await API.consumidor.cambiarCantidad(idConsumidor, idProducto, cantidad);
        return response.data;
    } catch (error) {
        console.error('Error actualizando cantidad del producto:', error);
        throw error;
    }
};

export default axiosActualizarCantidadProducto;