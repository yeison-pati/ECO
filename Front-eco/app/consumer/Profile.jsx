import { StyleSheet, View, Text, ScrollView } from "react-native"
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useEffect, useState } from "react";


import axiosProductos from "../../routes/axiosProductos";


import { fixImageUrl } from '../../utils/fixImageUrl';


import PromoBanner from "../components/PromoBanner";
import ProductSection from "../components/ProductSection";
import { useUser } from '../../Context/UserContext';
import LogoutButton from '../components/buttons/behavorial/LogOutbutton';

export default function Profile() {
    const { user } = useUser();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Perfil de Usuario</Text>
        {user ? (
          <View>
            <Text testID="name-label">Nombre: {user.nombre} {user.apellido}</Text>
            <Text testID="email-label">Correo: {user.correo}</Text>
            <Text testID="address-label">Dirección: null</Text>
            <Text testID="phone-label">Telefono: {user.telefono.numero}</Text>
            <Text testID="type-label">Tipo de Usuario: {user.rol}</Text>
          </View>
        ) : (
          <Text testID="noData-label">No pudimos recuperar tu información en este momento. Por favor, intenta nuevamente más tarde.</Text>
        )}
        <LogoutButton testID="logout-button" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});