
import { API } from '../api/axiosConfig';

const axiosRegister = async (userData) => {
    try {

        const basicData = {
            nombre: userData.nombre.trim(),
            correo: userData.correo.trim(),
            contrasena: userData.contrasena,
            rol: userData.rol.toUpperCase(),
            telefono: {
                indicativo: userData.telefono.indicativo.trim(),
                numero: userData.telefono.numero.trim()
            },
        };
        
        console.log("basicData: ", basicData)
            const response = await API.auth.register(basicData);
            console.log("Respuesta del registro:", response);
    return response.data;
  } catch (error) {
        console.error('Error en registro:', error);
        throw error;
    }
};

export default axiosRegister;
