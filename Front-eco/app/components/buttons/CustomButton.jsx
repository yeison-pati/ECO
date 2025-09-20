
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function CustomButton({ title, onPress, variant = "dark" }) {
  const isDark = variant === "dark";

  return (
    <TouchableOpacity
      style={[styles.button, isDark ? styles.dark : styles.light]}
      onPress={onPress}
    >
      <Text style={isDark ? styles.textDark : styles.textLight}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 160,
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    marginHorizontal: 10,
  },
  dark: {
    backgroundColor: "#93181B",
  },
  light: {
    backgroundColor: "#FEF3EF",
  },
  textDark: {
    color: "#FEF3EF",
    fontWeight: "bold",
    fontSize: 16,
  },
  textLight: {
    color: "#93181B",
    fontWeight: "bold",
    fontSize: 16,
  },
});