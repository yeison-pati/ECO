import { StatusBar } from "expo-status-bar";
import axiosProductos from "../../routes/axiosProductComerce";
import {
  ScrollView,
  View,
  StyleSheet,
  Dimensions,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import Font from "../components/aesthetic/Font";
import { useState, useEffect } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import CustomButton from "../components/buttons/CustomButton";
import { fixImageUrl } from "../../utils/fixImageUrl";
import ComerceProductCard from "../components/ComerceProductCard";
import { useAppNavigation } from "../hooks/useAppNavigation";
import { useUser } from "../../Context/UserContext";
import { ROUTES } from "../config/routes";
import LogOutButton from "../components/buttons/behavorial/LogOutbutton";
import defaultPic from '../../assets/icons/default-picture.png';

export default function Home() {
  const insets = useSafeAreaInsets();
  const navigate = useAppNavigation();
  const { user, logout} = useUser();
  
  const [products, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    if (!user) {

      console.error("No hay datos de usuario. Redirigiendo...");
      navigate.replace(ROUTES.SESSION.LOGIN);
      return;
    }
    console.log(user)

    loadProducts();
  }, [user]);


  const loadProducts = async () => {
    try {
      setLoading(true);


      const productosObtenidos = await axiosProductos(user.idUsuario, user.rol);
      setProductos(productosObtenidos);
      setError(null);
    } catch (error) {
      console.error("Error al obtener productos:", error);
      setError("No se pudieron cargar los productos. " + error.message);
    } finally {
      setLoading(false);
    }
  };


  if (loading) {
    return (
      <View style={[styles.root, styles.centerContent]}>
        <ActivityIndicator size="large" color="#05130A" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.root, styles.errorContainer]}>
        <Font mensage={error} variant="semibold" size={16} Color="red" />
        <View style={styles.buttonContainer}>
          <CustomButton
            title="Reintentar"
            onPress={loadProducts}
            variant="dark"
          />
          <CustomButton
            title="Cerrar sesión"
            onPress={logout}
            variant="light"
          />
        </View>
      </View>
    );
  }

  const comerce = products.length > 0 ? products[0].comerciante : null;

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <View style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}>
        {comerce && (
          <Font
            key={comerce.idUsuario}
            mensage={comerce.nombre}
            variant="semibold"
            size={35}
            Color="#93181B"
            style={{ paddingTop: 7, margin: 12 }}
          />
        )}
        <ScrollView>
          <Font
            mensage={user.nombre}
            variant="bold"
            size={18}
            Color="#05130A"
            style={{ paddingTop: 10, paddingLeft: 19 }}
          />
          {comerce && comerce.imagen ? (
            <View style={styles.logoContainer}>
              <Image
                source={{ uri: fixImageUrl(comerce.imagen) }}
                style={styles.image}
              />
            </View>
          ) : (
            <View style={styles.logoContainer}>
              <Image
                source={defaultPic}
                style={styles.image}
              />
            </View>
          )}


          <Font
            mensage="Productos ofrecidos"
            variant="bold"
            size={18}
            Color="#05130A"
            style={{ paddingTop: 10, paddingLeft: 19 }}
          />
          <View style={styles.buttonContainer}>
            <CustomButton
              title="Agregar producto"
              onPress={() => navigate.toAddProduct()}
              variant="dark"
            />
            {/*<CustomButton
                        title="Ordenes"
                        onPress={() => navigation.navigate('Order')}
                        variant="dark"
                    />*/}
          </View>
          <View style={styles.productContainer}>
            {products.length === 0 ? (
              <View style={styles.mensageProduct}>
                <Font
                  mensage="Aun no tienes producto para ofrecer"
                  variant="bold"
                  size={18}
                  Color="#93181B"
                />
              </View>
            ) : (
              products.map((product) => (
                <View
                  key={product.idProducto}
                  style={[styles.productCardWrapper, { marginBottom: 16 }]}
                >
                  <ComerceProductCard
                    id={product.idProducto}
                    nombre={product.nombre}
                    precio={product.precio}
                    imagen={product.imagen}
                  />
                </View>
              ))
            )}
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const screenWidth = Dimensions.get("window").width;
const CARD_MARGIN = 6;
const CARD_COLUMNS = 3;
const CARD_WIDTH =
  (screenWidth - CARD_MARGIN * (CARD_COLUMNS + 1)) / CARD_COLUMNS;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#FEF3EF",
    width: "100%",
    height: "100%",
  },
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  background: {
    backgroundColor: "#FEF3EF",
    width: "100%",
    height: "100%",
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    paddingTop: 29,
  },
  mensageProduct: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
  },
  image: {
    width: 325,
    height: 308,
    marginBottom: 10,
    borderRadius: 30,
  },
  logoContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 12,
    marginBottom: 20,
  },
  productContainer: {
    paddingTop: 15,
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    gap: 5,
  },
  productCardWrapper: {
    width: CARD_WIDTH,
    margin: CARD_MARGIN / 3,
    paddingLeft: 1,
  },
});
