import { View, Text, StyleSheet } from "react-native";
import React from "react";
import Font from "../aesthetic/Font";
import CustomButton from "../buttons/CustomButton";

export default function OverBottom({ message, onPress }) {
  return (
    <View style={styles.overlay}>
      <View style={styles.alertContainer}>
        <Font
          mensage="SE PRODUJO UN ERROR"
          variant="bold"
          size={43}
          Color="#05130A"
        />
        <Font
          mensage={message}
          variant="SemiBold"
          size={19}
          Color="#05130A"
          style={{ paddingTop: 10 }}
        />
        <View style={styles.buttons}>
          <CustomButton title="VOLVER" variant="dark"
          onPress={onPress} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(174, 165, 165, 0.53)", // fondo gris semitransparente
    justifyContent: "flex-end", // para que el contenido esté abajo
    alignItems: "center",
    zIndex: 10,
  },
  alertContainer: {
    backgroundColor: "#FFFFFF",
    width: "100%",
    borderTopLeftRadius: 57, // Sin radio de borde en la parte superior
    borderTopRightRadius: 57, // Sin radio de borde en la parte superior
    borderBottomLeftRadius: 0, // Radio de borde solo en la parte inferior
    borderBottomRightRadius: 0, // Radio de borde solo en la parte inferior
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
