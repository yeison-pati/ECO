



import { API } from '../api/axiosConfig';


const axiosProductoPorId = async (idConsumidor, idProducto) => {
    try {
        const response = await API.consumidor.getProducto(idConsumidor, idProducto);
        return response.data;
    } catch (error) {
        console.error('Error obteniendo producto:', error);
        throw error;
    }
};

export default axiosProductoPorId;