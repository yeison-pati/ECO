import { API } from '../api/axiosConfig';

const axiosLogin = async (correo, contrasena) => {
    try {
        if (!correo || !contrasena) {
            throw new Error('Correo y contraseña son requeridos');
        }


        const credentials = {
            correo: correo.trim(),
            contrasena: contrasena.trim()
        };
        
        const response = await API.auth.login(credentials);
        

        if (!response || !response.data) {
            throw new Error('Respuesta inválida del servidor');
        }

        return response.data;
    } catch (error) {
        console.error('Error en login:', error);

        throw new Error(error.response?.data?.message || error.message || 'Error en el inicio de sesión');
    }
};

export default axiosLogin;
