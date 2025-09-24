



import { API } from '../api/axiosConfig';






export default async function axiosAgregarProductoAlCarrito(idConsumidor, idProducto, cantidad) {
    try {
        const response = await API.consumidor.agregarAlCarrito(idConsumidor, idProducto, cantidad);
        return response.data;
    } catch (error) {
        console.error('Error al agregar producto al carrito:', error);
        throw error;
    }
}