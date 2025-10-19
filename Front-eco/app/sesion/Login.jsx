import React, { useEffect, useRef, useState } from "react";
import { View, StyleSheet, TextInput, Text, TouchableOpacity } from "react-native";
import CustomButton from "../components/buttons/CustomButton";
import { useUser } from "../../Context/UserContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import BackButton from "../components/buttons/behavorial/BackButton";
import Font from "../components/aesthetic/Font";
import { useAppNavigation } from "../hooks/useAppNavigation";
import ErrorMessage from "../components/alerts/ErrorMessage";
import OverBottom from "../components/alerts/OverBottom";

export default function Login() {
  const insets = useSafeAreaInsets();
  const { login, error, clearError, loading } = useUser();
  const navigate = useAppNavigation();

  const contrasenaInput = useRef(null);

  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [errorCorreo, setErrorCorreo] = useState(false);
  const [errorAlert, setErrorAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

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
    if (error) {
      setErrorMessage(error);
      setErrorAlert(true);
    }
  }, [error]);

  const handleLogin = async () => {
    try {

      if (!correo || !contrasena) {
        setErrorMessage("Por favor, complete todos los campos");
        setErrorAlert(true);
        return;
      }
      
      if (errorCorreo) {
        setErrorMessage("Por favor, ingrese un correo electrónico válido");
        setErrorAlert(true);
        return;
      }
      

      setErrorAlert(false);
      setErrorMessage("");
      clearError();
      

      const response = await login(correo.toLowerCase(), contrasena);
      


      console.log("Login exitoso:", response);
      
    } catch (loginError) {

      console.error("Error en handleLogin:", loginError);

    }
  };

  const handleCloseAlert = () => {
    setErrorAlert(false);
    setErrorMessage("");
    clearError();
  };

  return (
    <View
      style={[
        styles.root,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
    >
      <BackButton onPress={navigate.back} />
      <View style={styles.container}>
        <Font
          mensage="Iniciar Sesión"
          variant="bold"
          size={35}
          Color="#05130A"
          style={styles.title}
        />
        
        <View style={styles.inputContainer}>
          <TextInput
            testID="login-email-input"
            style={[styles.input, errorCorreo && styles.inputError]}
            placeholder="Correo electrónico"
            value={correo}
            onChangeText={setCorreo}
            keyboardType="email-address"
            autoCapitalize="none"
            returnKeyType="next"
            onSubmitEditing={() => contrasenaInput.current?.focus()}
            editable={!loading}
            accessibilityLabel="email-input"
          />
          {errorCorreo && (
            <ErrorMessage message="Formato de correo electrónico inválido" />
          )}
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            testID="login-password-input"
            ref={contrasenaInput}
            style={styles.input}
            placeholder="Contraseña"
            value={contrasena}
            onChangeText={setContrasena}
            secureTextEntry
            returnKeyType="done"
            onSubmitEditing={handleLogin}
            editable={!loading}
            accessibilityLabel="password-input"
          />
        </View>

        <CustomButton
          testID="login-submit-button"
          title={loading ? "Iniciando sesión..." : "Iniciar Sesión"}
          onPress={handleLogin}
          variant="dark"
          style={styles.loginButton}
          disabled={loading}
        />

        <TouchableOpacity
          testID="login-register-link"
          onPress={navigate.toRegister}
          style={styles.registerLink}
          disabled={loading}
          accessibilityRole="button"
          accessibilityLabel="register-link"
        >
          <Text style={[
            styles.registerText,
            loading && styles.disabledText
          ]}>
            ¿No tienes una cuenta? Regístrate aquí
          </Text>
        </TouchableOpacity>

        {/* Alerta de error */}
        {errorAlert && (
          <OverBottom
            title={errorMessage === "" ? "LOGIN EXITOSO" : "ERROR AL INICIAR SESIÓN"}
            message={errorMessage}
            onPress={handleCloseAlert}
          />
        )}

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#FEF3EF",
  },
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  title: {
    marginBottom: 30,
    textAlign: "center",
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#DDDDDD",
  },
  inputError: {
    borderColor: "#E54C4D",
  },
  loginButton: {
    marginTop: 20,
  },
  registerLink: {
    marginTop: 20,
    alignItems: "center",
  },
  registerText: {
    color: "#93181B",
    fontSize: 16,
  },
  disabledText: {
    opacity: 0.5,
  },
});