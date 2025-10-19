import { TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';

import axiosAgregarProductoAlCarrito from '../../routes/axiosAgregarProductoAlCarrito';
import OverBottom from './alerts/OverBottom';
import { useState } from 'react';
import { useUser } from '../../Context/UserContext';
import axiosCarrito from '../../routes/axiosCarrito';

export default function AddToCartButton({ idConsumidor, idProducto, cantidad, testID, maximo }) {
    const { user } = useUser();
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleAddToCart = async () => {
        const cantidadNum = Number(cantidad);
        const maximoNum = Number(maximo);

        console.log(cantidadNum)
        console.log(maximoNum)

        if (isNaN(cantidadNum) || isNaN(maximoNum)) {
            setError(true);
            setErrorMessage('Error interno: cantidad o stock inválido');
            return;
        }

        if (cantidadNum > maximoNum) {
            setError(true);
            setErrorMessage('Cantidad excede el stock disponible');
            return;
        }

        try {
            const carrito = await axiosCarrito(user.idUsuario);
            console.log('carrito:', carrito);

            const productos = carrito?.productos ?? [];

            const idBuscado = String(idProducto);
            const productoEnCarrito = productos.find(p => String(p.id) === idBuscado);
            const cantidadActualEnCarrito = productoEnCarrito
                ? Number(productoEnCarrito.cantidad)
                : 0;

            if (cantidadActualEnCarrito + cantidadNum > maximoNum) {
                setError(true);
                setErrorMessage('La cantidad total en el carrito excede el stock disponible');
                return;
            }

            // Si pasa todas las validaciones
            await axiosAgregarProductoAlCarrito(idConsumidor, idProducto, cantidadNum);
            setSuccess(true);
        } catch (error) {
            console.error('Error al añadir al carrito:', error);
            setError(true);
            setErrorMessage('No se pudo añadir el producto al carrito');
        }
    };

    return (
        <>
            <TouchableOpacity
                testID={testID}
                style={styles.button}
                onPress={handleAddToCart}
                accessibilityRole="button"
            >
                <Text testID="add-to-cart-button" style={styles.buttonText}>Añadir al carrito</Text>
            </TouchableOpacity>
            {success ? (
                <OverBottom
                    title="Éxito"
                    message="Producto añadido al carrito"
                    onPress={() => setSuccess(false)}
                />
            ) : null}

            {error ? (
                <OverBottom
                    title="Error"
                    message={errorMessage}
                    onPress={() => setError(false)}
                />
            ) : null}
        </>
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