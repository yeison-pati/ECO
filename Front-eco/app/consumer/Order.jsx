import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import axiosLimpiarCarrito from '../../routes/axiosLimpiarCarrito';

const statusStyles = {
  PENDIENTE: {
    backgroundColor: '#facc15',
    icon: require('../../assets/icons/ordenPendiente.png'),
    text: 'Orden pendiente',
  },
  CONFIRMADA: {
    backgroundColor: '#22c55e',
    icon: require('../../assets/icons/ordenConfirmada.png'),
    text: 'Orden confirmada',
  },
  CANCELADA: {
    backgroundColor: '#ef4444',
    icon: require('../../assets/icons/ordenCancelada.png'),
    text: 'Orden cancelada',
  },
};

export default function Order() {
  const navigation = useNavigation();
  const route = useRoute();
  const { order } = route.params;

  const handleBackHome = async () => {
    try {
      await axiosLimpiarCarrito();
      navigation.navigate('Tabs', { screen: 'Inicio' })
    } catch (error) {
      console.error('Error al vaciar el carrito:', error);
    }
  };
 
  const { estadoOrden } = order;  
  
  const style = statusStyles[estadoOrden.toUpperCase()]

  return (
    <View style={styles.container}>
      {/* Modal flotante */}
      <View style={[styles.modal, { backgroundColor: style.backgroundColor, borderColor: style.borderColor }]}>
        <Image source={style.icon} style={styles.icon} />
        <Text style={styles.statusText}>{style.text}</Text>
        <TouchableOpacity style={styles.backButton} onPress={handleBackHome}>
          <Text style={styles.backText}>Volver al inicio</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    width: '85%', 
    padding: 36, 
    backgroundColor: '#fff',
    borderRadius: 16,
    alignItems: 'center',
    gap: 16,
  },
  statusText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  backButton: {
    marginTop: 20,
    backgroundColor: '#000',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  backText: {
    color: '#fff',
    fontSize: 16,
  },
  icon: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
  }
});