import { StyleSheet, View } from "react-native";
import Font from "../aesthetic/Font";
import CustomButton from "../buttons/CustomButton";

export default function OverMid({titulo, mensaje, op1, op2, onCancel, onConfirm }) {

  return (
    <View style={styles.overlay}>
      <View style={styles.alertContainer}>
        <Font
          mensage={titulo}
          variant="bold"
          size={43}
          Color="#05130A"
        />
        <Font
          mensage={mensaje}
          variant="SemiBold"
          size={19}
          Color="#05130A"
          style={{ paddingTop: 10 }}
        />
        <View style={styles.buttons}>
          <CustomButton
            title={op1}
            onPress={onCancel}
            variant="light"
          />
          <CustomButton
            title={op2}
            onPress={onConfirm}
            variant="dark"
          />
        </View>
      </View>
    </View>
  );
}



const styles = StyleSheet.create({
    overlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: "rgba(174, 165, 165, 0.53)",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 10,
    },
    alertContainer: {
      backgroundColor: "#FFFFFF",
      width: "100%",
      borderTopLeftRadius: 57,
      borderTopRightRadius: 57,
      borderBottomLeftRadius: 57,
      borderBottomRightRadius: 57,
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
