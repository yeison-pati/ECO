




import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';


import axiosActualizarCantidadProducto from '../../routes/axiosActualizarCantidadProducto';







export default function QuantitySelector({ cantidad: initialQuantity, onQuantityChange, style, idProducto, onQuantityUpdate }) {

    const [cantidad, setCantidad] = useState(initialQuantity);
    const [isUpdating, setIsUpdating] = useState(false);


    useEffect(() => {
        setCantidad(initialQuantity);
    }, [initialQuantity]);


    const actualizarCantidad = async (nuevaCantidad) => {
        try {
            setIsUpdating(true);
            

            if (idProducto) {
                await axiosActualizarCantidadProducto(idProducto, nuevaCantidad);
            }
            

            setCantidad(nuevaCantidad);
            

            if (onQuantityChange) {
                onQuantityChange(nuevaCantidad);
            }
            

            if (onQuantityUpdate) {
                onQuantityUpdate();
            }
            
        } catch (error) {
            console.error('Error al actualizar cantidad:', error);


            setCantidad(cantidad);
        } finally {
            setIsUpdating(false);
        }
    };


    const aumentarCantidad = () => {
        const nuevaCantidad = cantidad + 1;
        actualizarCantidad(nuevaCantidad); 
    };


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