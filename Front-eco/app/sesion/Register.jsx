import React, { useRef, useState, useEffect } from "react";
import { View, StyleSheet, TextInput, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useUser } from "../../Context/UserContext";
import Font from "../components/aesthetic/Font";
import CustomButton from "../components/buttons/CustomButton";
import BackButton from "../components/buttons/behavorial/BackButton";
import { useAppNavigation } from "../hooks/useAppNavigation";
import PhoneInput from "../components/inputs/PhoneInput";
import ErrorMessage from "../components/alerts/ErrorMessage";
import OverBottom from "../components/alerts/OverBottom";

export default function Register() {
  const insets = useSafeAreaInsets();
  const { setUsuario } = useUser();
  const navigate = useAppNavigation();

  const correoInput = useRef(null);
  const contrasenaInput = useRef(null);
  const contrasenaVerInput = useRef(null);
  const indicativoInput = useRef(null);
  const numeroInput = useRef(null);

  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [contrasenaVer, setContrasenaVer] = useState("");
  const [indicativo, setIndicativo] = useState("");
  const [numero, setNumero] = useState("");

  const [errorMessage, setErrorMessage] = useState("");
  const [errorAlert, setErrorAlert] = useState(false);
  const [errorContrasena, setErrorContrasena] = useState(false);
  const [errorCorreo, setErrorCorreo] = useState(false);
  const [errorindicativo, setErrorindicativo] = useState(false);
  const [errornumero, setErrornumero] = useState(false);

  useEffect(() => {
    setErrorCorreo(
      correo !== "" &&
        (!/^[a-zA-Z0-9]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/.test(correo) ||
          correo.endsWith(".") ||
          correo.startsWith(".") ||
          correo.includes(".."))
    );
  }, [correo]);

  useEffect(() => {
    setErrorContrasena(contrasena !== contrasenaVer);
  }, [contrasena, contrasenaVer]);

  useEffect(() => {
    setErrorindicativo(
      indicativo !== "" &&
        (indicativo.length > 3 ||
          !/^\d+$/.test(indicativo) ||
          indicativo.startsWith("0"))
    );
  }, [indicativo]);

  useEffect(() => {
    setErrornumero(
      numero !== "" &&
        (numero.length != 10 || !/^\d+$/.test(numero) || numero.startsWith("0"))
    );
  }, [numero]);

  const handleRegister = () => {
    if (
      errorCorreo ||
      errorContrasena ||
      errorindicativo ||
      errornumero
    ) {
      setErrorAlert(true);
      setErrorMessage("Por favor, verifica todos los campos");
      return;
    }

    if (
      !correo ||
      !contrasena ||
      !contrasenaVer ||
      !nombre ||
      !indicativo ||
      !numero
    ) {
      setErrorAlert(true);
      setErrorMessage("Por favor, completa todos los campos");
      return;
    }

    const nuevoUsuario = {
      nombre: nombre,
      correo: correo.toLowerCase(),
      telefono: { indicativo: indicativo, numero: numero },
      contrasena: contrasena,
    };

    setUsuario(nuevoUsuario);
    navigate.toSelectProfile();
  };

  return (
    <View
      style={[
        styles.root,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
    >
      <BackButton onPress={navigate.back} />

      <ScrollView 
        style={styles.scrollContainer} 
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
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
            mensage="Al crear tu cuenta prodras acceder a productos frescos con precios reducidos"
            variant="semiBold"
            size={19}
            Color="#05130A"
            style={{ paddingTop: 10 }}
          />
        </View>

        <TextInput
          style={styles.input}
          value={nombre}
          onChangeText={(text) => setNombre(text)}
          placeholder="Nombre o Empresa"
          autoFocus={true}
          autoCorrect={false}
          keyboardType="default"
          returnKeyType="next"
          onSubmitEditing={() => correoInput.current.focus()}
        />

        <TextInput
          style={styles.input}
          value={correo}
          onChangeText={(text) => setCorreo(text)}
          ref={correoInput}
          autoCorrect={false}
          placeholder="Correo"
          onSubmitEditing={() => contrasenaInput.current.focus()}
        />
        {errorCorreo && (
          <View style={styles.errorContainer}>
            <ErrorMessage message="Correo electrónico inválido" />
          </View>
        )}

        <TextInput
          secureTextEntry
          style={styles.input}
          value={contrasena}
          onChangeText={(text) => setContrasena(text)}
          ref={contrasenaInput}
          placeholder="Contraseña"
          onSubmitEditing={() => contrasenaVerInput.current.focus()}
        />

        <TextInput
          secureTextEntry
          style={styles.input}
          value={contrasenaVer}
          onChangeText={(text) => setContrasenaVer(text)}
          ref={contrasenaVerInput}
          placeholder="Confirmar contraseña"
          onSubmitEditing={() => numeroInput.current.focus()}
        />
        {errorContrasena && (
          <View style={styles.errorContainer}>
            <ErrorMessage message="Las contraseñas no coinciden" />
          </View>
        )}

        <PhoneInput
          indicativoValue={indicativo}
          numeroValue={numero}
          onIndicativoChange={setIndicativo}
          onNumeroChange={setNumero}
          indicativoError={errorindicativo && "Codigo invalido"}
          numeroError={errornumero && "numero inválido"}
          indicativoRef={indicativoInput}
          numeroRef={numeroInput}
        />

        <View style={styles.buttonContainer}>
          <CustomButton
            title="SIGUIENTE"
            onPress={handleRegister}
            variant="dark"
          />
        </View>
      </ScrollView>

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
  scrollContainer: {
    flex: 1,
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
  errorContainer: {
    marginHorizontal: 20,
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
  containernumero: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginVertical: 10,
  },
  inputCodigoPais: {
    flex: 1,
    marginRight: 5,
  },
  inputnumero: {
    flex: 2,
    marginLeft: 5,
  },
  buttonContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    paddingBottom: 30,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(174, 165, 165, 0.53)",
    justifyContent: "flex-end",
    alignItems: "center",
    zIndex: 10,
  },
  alertContainer: {
    backgroundColor: "#FFFFFF",
    width: "100%",
    borderTopLeftRadius: 57,
    borderTopRightRadius: 57,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    padding: 20,
    paddingTop: 90,
    alignItems: "center",
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    marginTop: 30,
    marginBottom: 10,
    width: "100%",
    paddingBottom: 25,
  },
});