// En el componente LogOutButton
import { StyleSheet, TouchableOpacity, View, Image } from "react-native";
import { useUser } from "../../../../Context/UserContext";

export default function LogOutButton() {
  const { logout } = useUser();
  
  const handleLogout = async () => {
      await logout();
  };

  return (
    <TouchableOpacity style={styles.logOut} onPress={handleLogout}>
      <Image
        source={require("../../../../assets/icons/logOut.png")}
        style={styles.icon}
      />
    </TouchableOpacity>
  );
}

// Estilos...
const styles = StyleSheet.create({
  logOut: {
    // Estilo para el contenedor del botón de cerrar sesión
    position: 'absolute', // Permite posicionar el elemento independientemente del flujo normal
    bottom: 20,          // Lo coloca a 20 píxeles desde la parte inferior
    left: 20,            // Lo coloca a 20 píxeles desde la izquierda
    zIndex: 1,           // Asegura que el botón esté por encima de otros elementos si es necesario
    width: 45,
    height: 45,
  },
  icon: {
    // Estilo para la imagen del icono de cerrar sesión
    width: 45,
    height: 45,
    resizeMode: "contain", // Asegura que la imagen se ajuste al contenedor sin deformarse
  },
});