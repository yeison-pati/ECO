// Componente CleanCartButton
// Botón que permite al usuario vaciar completamente el carrito de compras con una confirmación previa.

//Importación de componentes de React Native
import { TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';

// Importación de la función que llama al backend para limpiar el carrito
import axiosLimpiarCarrito from '../../routes/axiosLimpiarCarrito';

// Props:
//  - onSuccess: Función opcional que se ejecuta después de limpiar exitosamente el carrito, por ejemplo, para actualizar la vista del carrito en pantalla.
export default function CleanCartButton ({ onSuccess }) {

    // Muestra una alerta de confirmación antes de vaciar el carrito
    const handleCleanCart = async () => {
        Alert.alert(
          'Limpiar carrito',
          '¿Estás seguro de vaciar todo el carrito?',
          [
            {
              text: 'Cancelar',
              style: 'cancel',
            },
            {
              text: 'Limpiar',
              onPress: async () => {
                try {
                  await axiosLimpiarCarrito(); // Llama al backend para vaciar el carrito
                  Alert.alert('Éxito', 'Carrito vaciado correctamente');
                  if (onSuccess) onSuccess(); //Actualiza el carrito
                } catch (error) {
                  Alert.alert('Error', 'No se pudo vaciar el carrito');
                }
              },
            },
          ]
        );
      };

    return (
        <TouchableOpacity style={styles.cleanButton} onPress={handleCleanCart}> {/*Quita todos los productos del carrito*/}
            <Image source={require('../../assets/icons/cleanCart.png')} style={styles.cleanIcon} />
        </TouchableOpacity>
    );
}

//Estilos del componente
const styles = StyleSheet.create({
    cleanButton: {
        position: 'absolute',
        top: 20,
        right: 20,
        zIndex: 1,
        width: 45,
        height: 45,
    },
    cleanIcon: {
        width: 45,
        height: 45,
        resizeMode: 'contain',
    },
});