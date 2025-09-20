// axiosEliminarProductoDelCarrito
// Función asincrónica que realiza una solicitud GET al backend para eliminar un producto
// específico del carrito de compras, basado en su ID.

import { API } from '../api/axiosConfig';

//  Parámetro idConsumidor - El id del consumidor que desea eliminar el producto del carrito.
//  Parámetro idProducto - El id del producto que se desea eliminar del carrito.
const axiosEliminarProductoDelCarrito = async (idConsumidor, idProducto) => {
  try {
    const response = await API.consumidor.eliminarDelCarrito(idConsumidor, idProducto);
    return response.data;
  } catch (error) {
    console.error('Error eliminando producto del carrito:', error);
    throw error;
  }
}

export default axiosEliminarProductoDelCarrito;