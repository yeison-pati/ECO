import React, { useState } from "react";
import { StyleSheet, View, ActivityIndicator } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useUser } from "../../Context/UserContext";
import Font from "../components/aesthetic/Font";
import CustomButton from "../components/buttons/CustomButton";
import BackButton from "../components/buttons/behavorial/BackButton";
import { useAppNavigation } from "../hooks/useAppNavigation";
import AxiosRegister from "../../routes/AxiosRegister";
import AsyncStorage from "@react-native-async-storage/async-storage";
import OverBottom from "../components/alerts/OverBottom";

export default function SelectProfile() {
  const insets = useSafeAreaInsets();
  const { usuario, setUsuario, login } = useUser();
  const navigate = useAppNavigation();
  const [loading, setLoading] = useState(false);
  const [errorAlert, setErrorAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleTipo = async (rol) => {
    try {
      if (!usuario) {
        setErrorMessage(
          "No hay datos de usuario para registrar. Vuelve al paso anterior."
        );
        return;
      }

      if (rol === 'REPARTIDOR'){
        setErrorMessage('El repartidor no esta disponible en este momento');
        setErrorAlert(true);
        return;
      }

      setLoading(true);


      const usuarioConRol = {
        ...usuario,
        rol: rol,
      };

      setUsuario(usuarioConRol);


      const resultado = await AxiosRegister(usuarioConRol);

      if (!resultado?.idUsuario) {
        throw new Error(
          "Error al registrar: no se recibió ID del usuario en el servidor"
        );
      }

      

      await AsyncStorage.setItem("user", JSON.stringify(resultado));


      await login(usuario.correo, usuario.contrasena);

      /**el login establece el user que es el persintente en la app
       * en el layout verifico que unicamente pase a su home
       * ai este ya completo el registro
       * 
       * if (rol === 'COMERCIANTE'){
        navigate.toRegisterComerce();
      }
       */

    } catch (error) {
      console.error("Error en registro:", error);
      setErrorMessage(error.message || "Error al registrar. Intenta de nuevo.");
      setErrorAlert(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View
      style={[
        styles.root,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
    >
      <BackButton onPress={navigate.back} />

      <View style={styles.boxContainer}>
        <Font mensage="QUIEN SOY" variant="bold" size={43} Color="#05130A" />
        <Font
          mensage="Elige tu perfil para personalizar tu experiencia en EcoSurprise: "
          variant="semiBold"
          size={19}
          Color="#05130A"
          style={{ paddingTop: 10 }}
        />
        <Font
          mensage="¿Eres repartidor, comerciante o consumidor?"
          variant="semiBold"
          size={19}
          Color="#05130A"
          style={{ paddingTop: 10 }}
        />
      </View>

        {loading ? (
          <ActivityIndicator
            size="large"
            color="#05130A"
            style={{ marginTop: 30 }}
          />
        ) : (
          <View style={styles.buttons}>
            <CustomButton
              title="Consumidor"
              onPress={() => handleTipo("CONSUMIDOR")}
              variant="dark"
              disabled={loading}
            />
            <CustomButton
              title="Comerciante"
              onPress={() => handleTipo("COMERCIANTE")}
              variant="dark"
              disabled={loading}
            />
            <CustomButton
              title="Repartidor"
              onPress={() => handleTipo("REPARTIDOR")}
              variant="dark"
              disabled={loading}
            />
          </View>
        )}

        {errorAlert && (
          <OverBottom
            message={errorMessage}
            onPress={() => setErrorAlert(false)}
          />
        )}
      </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#FEF3EF",
  },
  boxContainer: {
    backgroundColor: "#FFE6D5",
    width: "100%",
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 57,
    borderBottomRightRadius: 57,
    padding: 20,
    paddingTop: 90,
    alignItems: "center",
  },
  buttons: {
    flex:1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    width: "100%",
    paddingBottom: 80,
    gap: 20,
  },
});
