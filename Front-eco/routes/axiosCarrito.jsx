



import { API } from '../api/axiosConfig';
import { fixImageUrl } from '../utils/fixImageUrl';

const axiosCarrito = async (idConsumidor) => {
    try {
        const response = await API.consumidor.getCarrito(idConsumidor);
        const { productos, total } = response.data;

        const productosConImagenArreglada = productos.map(producto => ({
            ...producto,
            imagen: fixImageUrl(producto.imagen),
        }));

        return {
            productos: productosConImagenArreglada,
            total,
        };
    } catch (error) {
        console.error('Error obteniendo carrito:', error);
        throw error;
    }
};

export default axiosCarrito;