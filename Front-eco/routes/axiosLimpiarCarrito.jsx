



import { API } from '../api/axiosConfig';

const axiosLimpiarCarrito = async (idConsumidor) => {
    try {
        const response = await API.consumidor.limpiarCarrito(parseInt(idConsumidor));
        return response.data;
    } catch (error) {
        console.error('Error limpiando carrito:', error);
        throw error;
    }
};

export default axiosLimpiarCarrito;