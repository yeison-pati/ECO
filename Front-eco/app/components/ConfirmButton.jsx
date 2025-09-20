//Importación de componentes de React Native y librerías
import { TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axiosConfirmarOrden from '../../routes/axiosConfirmarOrden';

export default function ConfirmButton() {
  const navigation = useNavigation();

  const handlePress = async () => {
    try {
      const fechaActual = new Date();

      // Construimos el objeto con la estructura requerida
      const ordenData = {
        fechaOrden: {
          anio: fechaActual.getFullYear(),
          mes: fechaActual.getMonth() + 1, // Los meses en JS van de 0 a 11
          dia: fechaActual.getDate()
        },
        direccionEntrega: {
          idDireccion: 3 //cambiar
        },
        pago: {
          estadoPago: 'PENDIENTE',
          metodoPago: 'EFECTIVO'
        }
      };

      const createdOrder = await axiosConfirmarOrden(ordenData); // Llamada a la función confirmación

        // Navegamos a la pantalla Order con la orden creada
        navigation.navigate('Order', { order: createdOrder });
        } catch (error) {
            console.error('Error al crear la orden:', error);
            Alert.alert('Error', 'Hubo un problema al confirmar la orden. Inténtalo de nuevo.');
        }
    };

  return (
    <TouchableOpacity style={styles.proceedButton} onPress={handlePress}>
      <Text style={styles.proceedButtonText}>Confirmar</Text>
    </TouchableOpacity>
  );
}

// Estilos del componente
const styles = StyleSheet.create({
  proceedButton: {
    marginVertical: 20,
    backgroundColor: '#A5D0A3',
    paddingVertical: 10,
    borderRadius: 25,
    alignItems: 'center',
  },
  proceedButtonText: {
    color: '#000000',
    fontWeight: 'bold',
    fontSize: 20,
  },
});