



import { TouchableOpacity, Image, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function BackButton({ navigation }) {
  const nav = navigation || useNavigation();

  return (
    <TouchableOpacity
      testID="back-button"
      style={styles.backButton}
      onPress={() => nav.goBack()}
      accessibilityRole="button"
      accessibilityLabel="back"
    >
      {/* Icono de flecha para representar el botón de regreso */}
      <Image
        testID="image-back-button"
        source={require("../../../../assets/icons/back.png")}
        style={styles.backIcon}
      />
    </TouchableOpacity>
  );
}


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
