import AsyncStorage from "@react-native-async-storage/async-storage";
import { API } from "../api/axiosConfig";

const axiosCreateProduct = async (idComerciante, producto, imagen) => {
  try {
    const formData = new FormData();

    if (producto) {
      const productoJson = JSON.stringify(producto);
      formData.append("producto", productoJson);
      console.log("✅ Producto JSON agregado:", productoJson);
    } else {
      throw new Error("El producto es requerido");
    }

    // Debug de la imagen
    if (imagen) {
      console.log("🖼️ Imagen recibida:", {
        hasFile: !!imagen.file,
        hasUri: !!imagen.uri,
        mimeType: imagen.mimeType || imagen.type,
        fileName: imagen.fileName || imagen.name,
        size: imagen.fileSize || imagen.size
      });

      if (imagen.file) {
        formData.append("imagen", imagen.file);
        console.log("✅ Imagen agregada como File");
      } else if (imagen.uri) {
        const imageFile = {
          uri: imagen.uri,
          type: imagen.mimeType || imagen.type || "image/jpeg",
          name: imagen.fileName || imagen.name || "product-image.jpg",
        };
        formData.append("imagen", imageFile);
        console.log("✅ Imagen agregada como React Native file:", imageFile);
      }
    } else {
      console.error("❌ No se recibió imagen");
      throw new Error("La imagen es requerida");
    }

    const token = await AsyncStorage.getItem('token');
    console.log("🔑 Token obtenido:", token ? "Sí" : "No");
    console.log("🎯 ID Comerciante:", idComerciante);

    const response = await API.comerciante.crearProducto(
      parseInt(idComerciante),
      formData,
      token
    );

    console.log("✅ Producto creado exitosamente:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Error creando producto:");
    console.error("- Message:", error.message);
    
    if (error.response) {
      console.error("- Status:", error.response.status);
      console.error("- Server Message:", error.response.data?.message);
      console.error("- Server Error:", error.response.data?.error);
      console.error("- Full Response Data:", error.response.data);
    }

    throw error;
  }
};

export default axiosCreateProduct;