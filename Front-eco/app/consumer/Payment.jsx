//Importaciones de componentes de React Native y librerías
import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import axiosCarrito from '../../routes/axiosCarrito'; // Llama a tu axiosCarrito

import BackButton from '../components/buttons/behavorial/BackButton';
import TotalCard from '../components/TotalCard';
import ConfirmButton from '../components/ConfirmButton';

export default function Payment() {

  const [total, setTotal] = useState(0); // Guarda el total aquí
    const [loading, setLoading] = useState(true); // Controla el estado de carga
    const insets = useSafeAreaInsets();

    // Función para obtener el carrito del backend
    const fetchCartTotal = async () => {
        try {
            setLoading(true);
            const data = await axiosCarrito(); // Obtén los datos del carrito
            setTotal(data.total); // Establece el total recibido
        } catch (error) {
            console.error('Error al obtener el carrito:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCartTotal(); // Ejecuta la función cuando el componente se monte
    }, []);

    if (loading) {
        return <ActivityIndicator size="large" color="#617957" style={{ flex: 1, justifyContent: 'center' }} />;
    }

  return (
    <View style={[styles.root, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
       {/* Boton superior: regresar */}
       <View style={styles.buttonContainer}>
          <BackButton />
        </View>

        <View style={styles.container}>
          {/* Título principal */}
          <Text style={styles.title}>Caja</Text>
          
          <Text style={styles.subtitle}>Método de pago</Text>
          

          <View style={styles.paymentMethod}>
            <View style={styles.leftSection}>
              <Image source={require('../../assets/icons/monedas.png')} style={styles.imagen} />
              <Text style={styles.paymentText}>Efectivo</Text>
            </View>

            <Image source={require('../../assets/icons/seleccionado.png')} style={styles.imagenSeleccion} />
          </View>

        </View>
       
        {/* Parte inferior: botones y total */}
        <View style={styles.bottomSection}>
          <TotalCard total={total} />
          <ConfirmButton/>
        </View>            
    </View>
  );
}

//Estilos de la pantalla
const styles = StyleSheet.create({
  root: {
      flex: 1,
      backgroundColor: '#FEF3EF',
      marginTop: 10,
  },
  container: {
      flex: 1,
      paddingHorizontal: 20,
  },
  buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 80,
      
  },
  title: {
      fontSize: 28,
      fontWeight: 'bold',
      marginBottom: 20,
      color: '#050505',
      fontWeight: "bold",
  },
  subtitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#050505',
    fontWeight: "bold",
  },
  bottomSection: {
      paddingBottom: 10,
      paddingTop: 30,
      paddingHorizontal: 20,
      backgroundColor: '#DEFFD2B3', //Color al 70%
      borderRadius: 25,
  },
  imagen:{
      width: 60,
      height: 60,

  },
  imagenSeleccion:{
    width: 30,
    height: 30,
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    justifyContent: 'space-between',
    
  },
  paymentText: {
    fontSize: 20,
    marginLeft: 15,
    color: '#050505',
    paddingHorizontal: 15,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});