import React, { useState, useEffect } from "react";
import { View, StyleSheet, TextInput, Alert, ActivityIndicator } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useUser } from "../../Context/UserContext";
import Font from "../components/aesthetic/Font";
import CustomButton from "../components/buttons/CustomButton";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AxiosCompleteComerce from "../../routes/AxiosCompleteComerce";
import DocumentPickerButton from "../components/buttons/files/DocumentPickerButton";
import BackButton from "../components/buttons/behavorial/BackButton";
import { useAppNavigation } from "../hooks/useAppNavigation";
import LogOutButton from "../components/buttons/behavorial/LogOutbutton";
import ErrorMessage from "../components/alerts/ErrorMessage";
import OverBottom from "../components/alerts/OverBottom";

export default function RegisterComerce() {
  const insets = useSafeAreaInsets();
  const { user, usuario, updateUserData, setUsuario } = useUser();

  useEffect(() => {
    setUsuario(null);
}, []);

  const navigate = useAppNavigation();


  const [camComercio, setCamComercio] = useState(null);
  const [nombreCamComercio, setNombreCamComercio] = useState("");
  const [rut, setRutSeleccionado] = useState(null);
  const [nombreRut, setRut] = useState("");
  const [nit, setNit] = useState("");
  const [errorNit, setErrorNit] = useState(false);

  const [errorAlert, setErrorAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [loading, setLoading] = useState(false);
  


  useEffect(() => {
    if (rut && rut.name) setRut(rut.name);
    else setRut("");

    if (camComercio && camComercio.name) setNombreCamComercio(camComercio.name);
    else setNombreCamComercio("");
  }, [rut, camComercio]);


  useEffect(() => {
    setErrorNit(
      nit !== "" &&
        (nit.length !== 10 || !/^\d+$/.test(nit) || nit.startsWith("0"))
    );
  }, [nit]);


  const handleCompleteComerce = async () => {
    try {
      if (errorNit){
        setErrorMessage("NIT invalido");
        setErrorAlert(true);
        return;
      } 
      if (!nit || !camComercio || !rut) {
        setErrorMessage("No pueden haber campos vacíos");
        setErrorAlert(true);
        return;
      }


      setLoading(true);


      const resultado = await AxiosCompleteComerce(
        user.idUsuario,
        nit,
        camComercio,
        rut
      );
      const storedUser = await AsyncStorage.getItem('user');
      const userJson = JSON.parse(storedUser);

      
      await updateUserData({
        ...userJson,
        nit: resultado.data.nit,
        camaraComercio: resultado.data.camaraComercio,
        rut: resultado.data.rut
      })
      if (!resultado) {
        throw new Error("No se recibieron datos del servidor");
      }
      


      console.log("resultado:", resultado)
      console.log("resultado y data:", resultado.data)

    } catch (error) {
      console.error("Error:", error);
      setErrorMessage(
        "Error al completar registro: " + (error.message || "Intente de nuevo")
        );
    } finally {
      setLoading(false);
      setErrorAlert(true);
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
        <Font mensage="REGISTRO" variant="bold" size={43} Color="#05130A" />
        <Font
          mensage="¡BIENVENIDO A ECOSURPRISE!"
          variant="semiBold"
          size={19}
          Color="#05130A"
          style={{ paddingTop: 10 }}
        />
        <Font
          mensage="Completa tu perfil de comerciante"
          variant="semiBold"
          size={19}
          Color="#05130A"
          style={{ paddingTop: 10 }}
        />
      </View>


      <TextInput
        testID="register-commerce-nit-input"
        style={styles.input}
        value={nit}
        onChangeText={(text) => setNit(text)}
        placeholder="NIT"
        keyboardType="numeric"
        accessibilityLabel="nit-input"
      />
      {errorNit && (
        <ErrorMessage message="NIT invalido" />
      )}

      
      <View style={styles.containerInputIcon}>
        <TextInput
          testID="register-commerce-camara-comercio-input"
          style={styles.inputFile}
          placeholder="C. Comercio (PDF)"
          value={nombreCamComercio}
          editable={false}
          accessibilityLabel="camara-comercio-input"
        />
        <View style={styles.iconContainer}>
          <DocumentPickerButton
            testID="register-commerce-camara-comercio-picker"
            documento={camComercio}
            setDocumento={setCamComercio}
          />
        </View>
      </View>
      <View style={styles.containerInputIcon}>
        <TextInput
          testID="register-commerce-rut-input"
          style={styles.inputFile}
          placeholder="RUT (PDF)"
          value={nombreRut}
          editable={false}
          accessibilityLabel="rut-input"
        />
        <View style={styles.iconContainer}>
          <DocumentPickerButton
            testID="register-commerce-rut-picker"
            documento={rut}
            setDocumento={setRutSeleccionado}
          />
        </View>
      </View>

      {loading ? (
          <ActivityIndicator
            size="large"
            color="#05130A"
            style={{ marginTop: 30 }}
          />
        ) : (
      <CustomButton
        testID="register-commerce-submit-button"
        title="Completar registro"
        onPress={handleCompleteComerce}
        variant="dark"
        loading={loading}
      />
      )}

      <LogOutButton/>

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
  input: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    marginVertical: 10,
    height: 54,
    paddingHorizontal: 20,
    borderRadius: 57,
    borderColor: "#ccc",
    borderWidth: 1,
    fontSize: 16,
  },
  inputFile: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    height: 54,
    paddingHorizontal: 20,
    borderRadius: 57,
    borderColor: "#ccc",
    borderWidth: 1,
    fontSize: 16,
  },
  containerInputIcon: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    marginVertical: 10,
  },
  iconContainer: {
    marginLeft: 10,
  },
});
