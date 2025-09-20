//axiosCarrito
// Función asincrónica que realiza una solicitud GET al backend para obtener los productos
// actualmente agregados al carrito de compras, junto con el total acumulado.

import { API } from '../api/axiosConfig';
import { fixImageUrl } from '../utils/fixImageUrl'; // Función que corrige las URLs de imágenes locales

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