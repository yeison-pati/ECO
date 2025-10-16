
import { TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { API } from '../../api/axiosConfig';
import { useUser } from '../../Context/UserContext';

export default function ConfirmButton() {
  const navigation = useNavigation();
  const { user } = useUser();

  const handlePress = async () => {
    if (!user || !user.idUsuario) {
      Alert.alert('Error', 'Usuario no autenticado');
      return;
    }
    try {
      const fechaActual = new Date();


      const ordenData = {
        fechaOrden: {
          anio: fechaActual.getFullYear(),
          mes: fechaActual.getMonth() + 1,
          dia: fechaActual.getDate()
        },
        direccionEntrega: {
          idDireccion: 3
        },
        pago: {
          estadoPago: 'PENDIENTE',
          metodoPago: 'EFECTIVO'
        }
      };

      const createdOrder = await API.consumidor.crearOrden(user.idUsuario, ordenData);


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