import { API } from '../api/axiosConfig';

const axiosLogin = async (correo, contrasena) => {
    try {
        if (!correo || !contrasena) {
            throw new Error('Correo y contraseña son requeridos');
        }

        // El backend espera un objeto con correo y contrasena
        const credentials = {
            correo: correo.trim(),
            contrasena: contrasena.trim()
        };
        
        const response = await API.auth.login(credentials);
        
        // Validación de la respuesta
        if (!response || !response.data) {
            throw new Error('Respuesta inválida del servidor');
        }

        return response.data;
    } catch (error) {
        console.error('Error en login:', error);
        // Aseguramos que siempre se lance un error con mensaje
        throw new Error(error.response?.data?.message || error.message || 'Error en el inicio de sesión');
    }
};

export default axiosLogin;
