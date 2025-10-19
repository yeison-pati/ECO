import { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Image, StyleSheet } from 'react-native';

export default function QuantitySelector({
    cantidad: initialQuantity,
    onQuantityChange,
    style,
    testID,
    maximo
}) {
    const [cantidad, setCantidad] = useState(initialQuantity);
    const [cantidadInput, setCantidadInput] = useState(String(initialQuantity));
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        setCantidad(initialQuantity);
        setCantidadInput(String(initialQuantity));
    }, [initialQuantity]);

    const actualizarCantidad = (nuevaCantidad) => {
        setCantidad(nuevaCantidad);
        setCantidadInput(String(nuevaCantidad));
        if (onQuantityChange) onQuantityChange(nuevaCantidad);
    };


    const aumentarCantidad = () => {
        const nuevaCantidad = cantidad + 1;
        if (nuevaCantidad > maximo) {
            setCantidadInput(String(cantidad));
            return;
        };
        actualizarCantidad(nuevaCantidad);
    };

    const disminuirCantidad = () => {
        if (cantidad > 1) {
            const nuevaCantidad = cantidad - 1;
            actualizarCantidad(nuevaCantidad);
        }
    };

    return (
        <View style={[styles.quantityWrapper, style]} testID={testID}>
            {/* Botón disminuir */}
            <TouchableOpacity
                testID={testID ? `${testID}-decrease` : undefined}
                onPress={disminuirCantidad}
                accessibilityRole="button"
            >
                <Image
                    source={require('../../assets/icons/minus.png')}
                    style={[styles.quantityIcon, (isUpdating || cantidad <= 1) && styles.disabledButton]}
                />
            </TouchableOpacity>

            {/* Campo editable */}
            <TextInput
                testID={testID ? `${testID}-input` : undefined}
                style={styles.quantityInput}
                value={isUpdating ? '...' : cantidadInput}
                onChangeText={(text) => {
                    // Permitir vacío para escribir libremente
                    setCantidadInput(text);
                }}
                onBlur={() => {
                    if (cantidadInput === '' || isNaN(parseInt(cantidadInput, 10))) {
                        actualizarCantidad(1); // vuelve a 1 si está vacío
                    } else {
                        const nuevaCantidad = parseInt(cantidadInput, 10);
                        actualizarCantidad(nuevaCantidad);
                    }
                }}
                keyboardType="numeric"
                textAlign="center"
                placeholder="1"
            />

            {/* Botón aumentar */}
            <TouchableOpacity
                testID={testID ? `${testID}-increase` : undefined}
                onPress={aumentarCantidad}
                accessibilityRole="button"
            >
                <Image
                    source={require('../../assets/icons/addBlack.png')}
                    style={[styles.quantityIcon, isUpdating && styles.disabledButton]}
                />
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
    quantityInput: {
        fontWeight: 'bold',
        width: 40,
        textAlign: 'center',
        fontSize: 18,
        marginHorizontal: 5,
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
