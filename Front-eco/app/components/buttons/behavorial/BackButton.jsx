// Componente BackButton
// Botón personalizado que permite al usuario regresar a la pantalla anterior.

//Importaciones de componentes de React Native y librerías
import { TouchableOpacity, Image, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function BackButton({ navigation }) {
  const nav = navigation || useNavigation(); // si no se pasa navigation (util en modals, etc)

  return (
    // Botón táctil que, al ser presionado, regresa a la pantalla anterior
    <TouchableOpacity style={styles.backButton} onPress={() => nav.goBack()}>
      {/* Icono de flecha para representar el botón de regreso */}
      <Image
        source={require("../../../../assets/icons/back.png")}
        style={styles.backIcon}
      />
    </TouchableOpacity>
  );
}

//Estilos del componente
const styles = StyleSheet.create({
  backButton: {
    position: "absolute",
    top: 20,
    left: 20,
    zIndex: 1,
    width: 45,
    height: 45,
  },
  backIcon: {
    width: 45,
    height: 45,
    resizeMode: "contain",
  },
});
