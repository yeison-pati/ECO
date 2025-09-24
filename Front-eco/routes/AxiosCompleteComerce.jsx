
import { API } from '../api/axiosConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AxiosCompleteComerce = async (id, nit, camaraComercio, rut) => {
    try {

        const formData = new FormData();
        

        formData.append('nit', nit);
        

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

        const token = await AsyncStorage.getItem('token');
        

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
        

        return API.comerciante.completarRegistro(id, formData, token);
    } catch (error) {
        console.error('Error en AxiosCompleteComerce:', error);
        throw error;
    }
};

export default AxiosCompleteComerce;