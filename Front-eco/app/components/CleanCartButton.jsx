



import { TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';


import axiosLimpiarCarrito from '../../routes/axiosLimpiarCarrito';



export default function CleanCartButton ({ onSuccess }) {


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
                  await axiosLimpiarCarrito();
                  Alert.alert('Éxito', 'Carrito vaciado correctamente');
                  if (onSuccess) onSuccess();
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