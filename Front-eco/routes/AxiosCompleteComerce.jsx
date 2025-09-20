// AxiosCompletarRegistroComerciante.jsx
import { API } from '../api/axiosConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AxiosCompleteComerce = async (id, nit, camaraComercio, rut) => {
    try {
        // Preparar el formData con el formato correcto para los archivos
        const formData = new FormData();
        
        // Añadir el NIT como un campo de texto normal
        formData.append('nit', nit);
        
        // Asegurarse de que los archivos tengan el formato correcto para el backend
        if (camaraComercio?.file) {
            formData.append("camaraComercio", camaraComercio.file);
          } else {
            camaraComercio.file = {
                name: camaraComercio.name,
                type: camaraComercio.mimeType,
                size: camaraComercio.size,
                uri: camaraComercio.uri
            }
            formData.append("camaraComercio", camaraComercio.file);
          }
          console.log(camaraComercio.file);

        // Asegurarse de que los archivos tengan el formato correcto para el backend
        if (rut?.file) {
            formData.append("rut", rut.file);
          } else {
            rut.file = {
                name: rut.name,
                type: rut.mimeType,
                size: rut.size,
                uri: rut.uri
            }
            formData.append("rut", rut.file);
          }
          console.log(rut.file);
        // Obtener el token actual para incluirlo en la petición
        const token = await AsyncStorage.getItem('token');
        
        // Log para depuración
        console.log('Enviando completarRegistro:', {
            id,
            nit,
            camaraComercio: camaraComercio ? { 
                uri: camaraComercio.uri,
                name: camaraComercio.name,
                type: camaraComercio.mimeType
            } : null,
            rut: rut ? { 
                uri: rut.uri,
                name: rut.name,
                type: rut.mimeType
            } : null,
            token: token, 
            tokenPresente: token ? true : false
        });
        
        // Llamar a la API con el formData y configuración correcta
        return API.comerciante.completarRegistro(id, formData, token);
    } catch (error) {
        console.error('Error en AxiosCompleteComerce:', error);
        throw error;
    }
};

export default AxiosCompleteComerce;