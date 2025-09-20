// axiosProductoPorId
// Función asincrónica que obtiene los datos de un producto específico desde el backend, 
// utilizando su identificador único (`id`).

import { API } from '../api/axiosConfig';

//  Párametro id - El ID del producto que se desea consultar.
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