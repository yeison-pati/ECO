import { TouchableOpacity, Image, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function BackButton({ navigation, onBack }) {
  const nav = navigation || useNavigation();

  const handlePress = async () => {
    try {
      if (typeof onBack === 'function') {
        await onBack();
      }
    } finally {
      nav.goBack();
    }
  };

  return (
    <TouchableOpacity
      testID="back-button"
      style={styles.backButton}
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityLabel="back"
    >
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
