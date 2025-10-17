
import { TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { API } from '../../api/axiosConfig';
import { useUser } from '../../Context/UserContext';
import useAppNavigation from '../hooks/useAppNavigation';

export default function ConfirmButton({ testID }) {
  const navigate = useAppNavigation();
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
        pago: {
          estadoPago: 'PENDIENTE',
          metodoPago: 'EFECTIVO'
        }
      };

      const response = await API.consumidor.crearOrden(user.idUsuario, ordenData);
      
      // Verificar que la respuesta contiene una orden válida
      if (response && response.estadoOrden) {
        navigate.toOrder(response);
      } else {
        // Si no tiene estadoOrden, probablemente es un error del backend
        const errorMsg = response.data?.mensaje || 'Error desconocido al crear la orden';
        Alert.alert('Error', errorMsg);
      }
    } catch (error) {
      console.error('Error al crear la orden:', error);
      const errorMsg = error.response?.data?.mensaje || 'Hubo un problema al confirmar la orden. Inténtalo de nuevo.';
      Alert.alert('Error', errorMsg);
    }
  };

  return (
    <TouchableOpacity
      testID={testID}
      style={styles.proceedButton}
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityLabel="confirm"
    >
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