



import { TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';


import axiosAgregarProductoAlCarrito from '../../routes/axiosAgregarProductoAlCarrito';




export default function AddToCartButton ({ idConsumidor, idProducto, cantidad })  {

    /**
     * Maneja el evento de presionar el botón.
     * Realiza una solicitud al backend para agregar el producto al carrito.
     * Muestra una alerta de éxito o error según el resultado.
     */
    const handleAddToCart = async () => {
        try {
            await axiosAgregarProductoAlCarrito(idConsumidor, idProducto, cantidad);
            Alert.alert('Éxito', 'Producto añadido al carrito');
        } catch (error) {
            console.error('Error al añadir al carrito:', error);
            Alert.alert('Error', 'No se pudo añadir el producto');
        }
    };
    
    return (

        <TouchableOpacity style={styles.button} onPress={handleAddToCart}>
            <Text style={styles.buttonText}>Añadir al carrito</Text>
        </TouchableOpacity>
    );
}


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