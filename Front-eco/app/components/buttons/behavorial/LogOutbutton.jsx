
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


const styles = StyleSheet.create({
  logOut: {

    position: 'absolute',
    bottom: 20,
    left: 20,
    zIndex: 1,
    width: 45,
    height: 45,
  },
  icon: {

    width: 45,
    height: 45,
    resizeMode: "contain",
  },
});