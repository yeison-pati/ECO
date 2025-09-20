// axiosAgregarProductoAlCarrito
// Función asincrónica que realiza una petición POST al backend para agregar un producto
// al carrito de compras. 

import { API } from '../api/axiosConfig';

// Parámetros:
// idConsumidor - ID del consumidor que realiza la operación.
// idProducto - ID del producto que se desea agregar al carrito.
// cantidad - Cantidad del producto que se desea agregar.

export default async function axiosAgregarProductoAlCarrito(idConsumidor, idProducto, cantidad) {
    try {
        const response = await API.consumidor.agregarAlCarrito(idConsumidor, idProducto, cantidad);
        return response.data;
    } catch (error) {
        console.error('Error al agregar producto al carrito:', error);
        throw error;
    }
}