



import { API } from '../api/axiosConfig';



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