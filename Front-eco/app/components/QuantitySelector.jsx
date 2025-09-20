// Componente QuantitySelector
// Componente reutilizable que permite al usuario aumentar o disminuir la cantidad de un producto.
// Al cambiar la cantidad, se actualiza el backend y el estado local.

// Importaciones de componentes de React Native y librerías
import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';

// Importación de la función que llama al backend para agregar actualizarla cantidad del producto en el carrito
import axiosActualizarCantidadProducto from '../../routes/axiosActualizarCantidadProducto';

// Props:
// - cantidad: Cantidad inicial del producto.
// - onQuantityChange: Callback que se ejecuta cuando cambia la cantidad local, actualiza el subtotal.
// - onQuantityUpdate: Callback que se ejecuta después de una actualización exitosa, actualiza la vista del carrito o el total.
// - style: Estilos personalizados para el contenedor del selector.
// - idProducto: ID del producto, necesario para actualizar la cantidad en el backend.
export default function QuantitySelector({ cantidad: initialQuantity, onQuantityChange, style, idProducto, onQuantityUpdate }) {

    const [cantidad, setCantidad] = useState(initialQuantity);
    const [isUpdating, setIsUpdating] = useState(false);

    // Se sincroniza el estado local cuando cambia la prop initialQuantity
    useEffect(() => {
        setCantidad(initialQuantity);
    }, [initialQuantity]);

    // Función para actualizar la cantidad, tanto en frontend como backend
    const actualizarCantidad = async (nuevaCantidad) => {
        try {
            setIsUpdating(true);
            
            // Actualizar en el backend
            if (idProducto) {
                await axiosActualizarCantidadProducto(idProducto, nuevaCantidad);
            }
            
            // Actualizar estado local
            setCantidad(nuevaCantidad);
            
            // Notificar al componente padre
            if (onQuantityChange) {
                onQuantityChange(nuevaCantidad);
            }
            
            // Notificar éxito para actualizar total y el carrito
            if (onQuantityUpdate) {
                onQuantityUpdate();
            }
            
        } catch (error) {
            console.error('Error al actualizar cantidad:', error);

            // Revertir a la cantidad anterior en caso de error
            setCantidad(cantidad);
        } finally {
            setIsUpdating(false);
        }
    };

    //Funcionn para aumentarCantidad
    const aumentarCantidad = () => {
        const nuevaCantidad = cantidad + 1;
        actualizarCantidad(nuevaCantidad); 
    };

    //Funcionn para disminuirrCantidad
    const disminuirCantidad = () => {
        if (cantidad > 1) {
            const nuevaCantidad = cantidad - 1;
            actualizarCantidad(nuevaCantidad);
        }
    };

    return (
        <View style={[styles.quantityWrapper, style]}>

            {/*Botón disminur cantidad*/}
            <TouchableOpacity onPress={disminuirCantidad}>
                <Image source={require('../../assets/icons/minus.png')} style={[styles.quantityIcon, (isUpdating || cantidad <= 1) && styles.disabledButton]} />
            </TouchableOpacity>

             {/* Texto que muestra la cantidad actual (o '...' mientras actualiza) */}
            <Text style={styles.quantity}> {isUpdating ? '...' : cantidad}</Text>

            {/*Botón aumentar cantidad*/}
            <TouchableOpacity onPress={aumentarCantidad}>
                <Image source={require('../../assets/icons/addBlack.png')} style={[
                        styles.quantityIcon,
                        isUpdating && styles.disabledButton
                    ]} />
            </TouchableOpacity>
        </View>
    );
}

//Estilos del componente
const styles = StyleSheet.create({
    quantityWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 20,
        paddingVertical: 10,
        paddingHorizontal: 5,
    },
    quantityIcon: {
        width: 30,
        height: 30,
        resizeMode: 'contain',
        marginHorizontal: 10,
    },
    quantity: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#050505',
    },
    disabledButton: {
        opacity: 0.5,
    },
});