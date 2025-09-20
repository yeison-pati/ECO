// axiosActualizarCantidadProducto
// Función asincrónica que realiza una petición PUT al backend para actualizar
// la cantidad de un producto específico en el carrito de compras.

import { API } from '../api/axiosConfig';

// Parámetros:
// idConsumidor - ID del consumidor que realiza la actualización.
// idProducto - ID del producto a actualizar.
// cantidad - Nueva cantidad que se desea establecer para el producto.
const axiosActualizarCantidadProducto = async (idConsumidor, idProducto, cantidad) => {
    try {
        const response = await API.consumidor.cambiarCantidad(idConsumidor, idProducto, cantidad);
        return response.data;
    } catch (error) {
        console.error('Error actualizando cantidad del producto:', error);
        throw error;
    }
};

export default axiosActualizarCantidadProducto;