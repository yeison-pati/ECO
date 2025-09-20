//Componente AddToCartButton
// Renderiza un botón que permite agregar un producto al carrito de compras al ser presionado.

// Importaciones de componentes de React Native y librerías
import { TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';

// Importación de la función que llama al backend para agregar productos al carrito
import axiosAgregarProductoAlCarrito from '../../routes/axiosAgregarProductoAlCarrito';

// Props:
// - idProducto: ID del producto que se desea agregar.
// - cantidad: Cantidad del producto a agregar.
export default function AddToCartButton ({ idProducto, cantidad })  {

    /**
     * Maneja el evento de presionar el botón.
     * Realiza una solicitud al backend para agregar el producto al carrito.
     * Muestra una alerta de éxito o error según el resultado.
     */
    const handleAddToCart = async () => {
        try {
            await axiosAgregarProductoAlCarrito(idProducto, cantidad);
            Alert.alert('Éxito', 'Producto añadido al carrito');
        } catch (error) {
            console.error('Error al añadir al carrito:', error);
            Alert.alert('Error', 'No se pudo añadir el producto');
        }
    };
    
    return (
        // Botón táctil que llama a handleAddToCart al ser presionado
        <TouchableOpacity style={styles.button} onPress={handleAddToCart}>
            <Text style={styles.buttonText}>Añadir al carrito</Text>
        </TouchableOpacity>
    );
}

// Estilos del componente
const styles = StyleSheet.create({
    button: {
        backgroundColor: '#A5D0A3',
        paddingVertical: 15,
        marginBottom: 10,
        borderRadius: 10,
        alignItems: 'center',
        width: '70%',
    },
    buttonText: {
        color: '#05130A',
        fontWeight: 'bold',
        fontSize: 20,
    },
});