import { API } from '../api/axiosConfig';

const axiosProductComerce = async (idComerciante) => {
    try {
        const response = await API.comerciante.getProductos(idComerciante);
        console.log('Productos:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error obteniendo productos:', error);
        throw error;
    }
};

export default axiosProductComerce;