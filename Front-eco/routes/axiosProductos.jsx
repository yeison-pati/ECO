import { API } from '../api/axiosConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

const axiosProductos = async (idUsuario, rol) => {
    try {
        let response;
        if (rol === "COMERCIANTE") {

            response = await API.comerciante.getProductos(idUsuario);
        } else {
            response = await API.consumidor.getProductos(idUsuario);
        }
        return response.data;
    } catch (error) {
        console.error("Error obteniendo productos:", error);
        throw error;
    }
};

export default axiosProductos;