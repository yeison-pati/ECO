import React from "react";
import { View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';



//Importaciones de componentes personalizados
import CustomButton from './components/buttons/CustomButton';
import Font from './components/aesthetic/Font';
import Circle from './components/figures/Circle';
import Logo from './components/figures/Logo';
import { useAppNavigation } from './hooks/useAppNavigation';

import "@expo/metro-runtime";

export default function Index() {
  const insets = useSafeAreaInsets();
  const navigate = useAppNavigation();

  return (
    <View style={[styles.root, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <View style={styles.background}>
        <Circle size={250} top={-0.13} right={-0.3} />
        <Circle size={400} bottom={0.1} left={-0.5} />
      </View>
      <View style={styles.logoContainer}>
        <Logo size={400} bottom={0.4} />
        <View style={styles.boxContainer}>
          <Font
            mensage="Bienvenido"
            variant="bold"
            size={43}
            Color="#05130A"
          />
          <Font
            mensage="Antes de disfrutar de diversas comidas a los mejores precios, crea una cuenta para estar al tanto de las próximas ofertas"
            variant="semiBold"
            size={19}
            Color="#05130A"
            style={{ paddingTop: 10 }}
          />
        </View>
        <View style={styles.buttons}>
          <CustomButton
            title="Iniciar Sesión"
            onPress={navigate.toLogin}
            variant="dark"
          />
          <CustomButton
            title="Registrarse"
            onPress={navigate.toRegister}
            variant="light"
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#E54C4D',
  },
  background: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  boxContainer: {
    flex: 1,
    backgroundColor: '#FFE6D5',
    width: '100%',
    height: '100%',
    borderRadius: 57,
    padding: 20,
    paddingTop: 90,
    top: '49%',
    alignItems: 'center',
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 10,
    width: '100%',
    paddingBottom: 25,
  },
});
