
import { StatusBar } from "expo-status-bar";
import { ScrollView, View, StyleSheet, TextInput } from "react-native";
import { useRef, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Font from "../components/aesthetic/Font";
import CustomButton from "../components/buttons/CustomButton";
import ImagePickerButton from "../components/buttons/files/ImagePickerButton";
import axiosCreateProduct from "../../routes/axiosCreateProduct";
import { useUser } from "../../Context/UserContext";
import OverBottom from "../components/alerts/OverBottom";
import { useAppNavigation } from "../hooks/useAppNavigation";

export default function AddProduct() {
  const { user } = useUser();
  const insets = useSafeAreaInsets();
  const navigate = useAppNavigation();

  const descripcionProducto = useRef(null);
  const tipoProducto = useRef(null);
  const precioProducto = useRef(null);
  const cantidadProducto = useRef(null);

  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [tipo, setTipo] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [imagen, setImagen] = useState(null);

  const [errorAlert, setErrorAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGuardar = async () => {
    if (!nombre || !descripcion || !tipo || !precio || !cantidad || !imagen) {
      setErrorAlert(true);
      setErrorMessage("Por favor, completa todos los campos e incluye una imagen.");
      return;
    }

    if (isNaN(precio) || isNaN(cantidad)) {
      setErrorAlert(true);
      setErrorMessage("Precio y cantidad deben ser números válidos.");
      return;
    }

    if (parseInt(precio) <= 0 || parseInt(cantidad) <= 0) {
      setErrorAlert(true);
      setErrorMessage("Precio y cantidad deben ser mayores a 0.");
      return;
    }

    const producto = {
      nombre: nombre.trim(),
      precio: parseInt(precio),
      stock: parseInt(cantidad),
      descripcion: descripcion.trim(),
      tipo: tipo.trim()
    };

    setLoading(true);
    
    try {
      await axiosCreateProduct(user.idUsuario, producto, imagen);
      setErrorMessage("¡Producto creado correctamente!");
      setErrorAlert(true);
      
      setTimeout(() => {
        setErrorAlert(false);
        navigate.toComerceHome();
      }, 2000);
      
    } catch (error) {
      console.error("Error en handleGuardar:", error);
      
      let errorMessage = "Error desconocido al crear el producto";
      
      if (error.message) {
        errorMessage = error.message;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }
    
      setErrorMessage(errorMessage);
      setErrorAlert(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      
      <ScrollView 
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        style={styles.scrollView}
      >
        <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom + 20 }]}>
          {/* Header */}
          <Font
            mensage="Creando Producto"
            variant="semibold"
            size={25}
            Color="#B3B3B3"
            style={styles.title}
          />

          {/* Image Picker */}
          <View style={styles.imageContainer}>
            <ImagePickerButton testID="add-product-image-picker" imagen={imagen} setImagen={setImagen} />
          </View>

          {/* Form Inputs */}
          <TextInput
            testID="add-product-name-input"
            style={styles.input}
            value={nombre}
            onChangeText={setNombre}
            placeholder="Nombre del producto"
            autoFocus={true}
            autoCorrect={false}
            returnKeyType="next"
            onSubmitEditing={() => descripcionProducto.current?.focus()}
            accessibilityLabel="product-name-input"
          />

          <TextInput
            testID="add-product-description-input"
            style={styles.input}
            value={descripcion}
            onChangeText={setDescripcion}
            ref={descripcionProducto}
            placeholder="Descripción del producto"
            autoCorrect={false}
            returnKeyType="next"
            onSubmitEditing={() => tipoProducto.current?.focus()}
            accessibilityLabel="product-description-input"
          />

          <TextInput
            testID="add-product-type-input"
            style={styles.input}
            value={tipo}
            onChangeText={setTipo}
            ref={tipoProducto}
            placeholder="Tipo de producto"
            autoCorrect={false}
            returnKeyType="next"
            onSubmitEditing={() => precioProducto.current?.focus()}
            accessibilityLabel="product-type-input"
          />

          <TextInput
            testID="add-product-price-input"
            style={styles.input}
            value={precio}
            onChangeText={setPrecio}
            ref={precioProducto}
            placeholder="Precio del producto"
            keyboardType="numeric"
            returnKeyType="next"
            onSubmitEditing={() => cantidadProducto.current?.focus()}
            accessibilityLabel="product-price-input"
          />

          <TextInput
            testID="add-product-quantity-input"
            style={styles.input}
            value={cantidad}
            onChangeText={setCantidad}
            ref={cantidadProducto}
            placeholder="Cantidad del producto"
            keyboardType="numeric"
            returnKeyType="done"
            onSubmitEditing={handleGuardar}
            accessibilityLabel="product-quantity-input"
          />

          {/* Button */}
          <View style={styles.buttonContainer}>
            <CustomButton
              testID="add-product-submit-button"
              title={loading ? "Creando..." : "Crear producto"}
              onPress={handleGuardar}
              variant="dark"
              disabled={loading}
            />
          </View>
        </View>
      </ScrollView>

      {errorAlert && (
        <OverBottom
          title={errorMessage === "¡Producto creado correctamente!" ? "ÉXITO" : "ERROR"}
          message={errorMessage}
          onPress={() => setErrorAlert(false)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { 
    flex: 1, 
    backgroundColor: "#FEF3EF" 
  },
  scrollView: {
    flex: 1,
  },
  container: {
    paddingBottom: 20,
  },
  title: {
    paddingLeft: 20,
    paddingVertical: 10,
  },
  imageContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  input: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    marginVertical: 10,
    height: 54,
    paddingHorizontal: 20,
    borderRadius: 57,
    borderColor: "#ccc",
    borderWidth: 1,
    fontSize: 16,
  },
  buttonContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginHorizontal: 20,
    marginBottom: 20,
  },
});