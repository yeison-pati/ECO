
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import IP from "./IP";


const axiosInstance = axios.create({
  baseURL: `http://${IP}:8080`,
  withCredentials: true,
  timeout: 10000,
});


let isRefreshing = false;


axiosInstance.interceptors.request.use(
  async (config) => {
    try {

      if (
        config.url.includes("/api/auth/login") ||
        config.url.includes("/api/auth/register") 
      ) {
        return config;
      }


      const token = await AsyncStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }


      if (config.data && !(config.data instanceof FormData)) {
        config.headers["Content-Type"] = "application/json";
      }

      return config;
    } catch (error) {
      console.error("Error en interceptor de request:", error);
      return config;
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);


axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.log(
      "Error en respuesta:",
      error?.response?.status || error.message
    );


    let customError = new Error();
    

    if (error.code === "ECONNABORTED") {
      customError.message = "Tiempo de espera agotado. La conexión es muy lenta.";
      customError.type = "TIMEOUT";
    } else if (!error.response) {
      customError.message = "Sin conexión al servidor. Verifica tu conexión a internet.";
      customError.type = "NETWORK";
    } else {

      const status = error.response.status;
      const serverMessage = error.response.data?.message || error.response.data?.error;
      
      switch (status) {
        case 400:
          customError.message = serverMessage || "Datos incorrectos enviados al servidor.";
          customError.type = "BAD_REQUEST";
          break;
        case 401:
          customError.message = "Credenciales incorrectas o sesión expirada.";
          customError.type = "UNAUTHORIZED";

          if (!isRefreshing) {
            await AsyncStorage.removeItem("token");
            await AsyncStorage.removeItem("user");
          }
          break;
        case 403:
          customError.message = "No tienes permisos para realizar esta acción.";
          customError.type = "FORBIDDEN";
          break;
        case 404:
          customError.message = serverMessage || "Recurso no encontrado.";
          customError.type = "NOT_FOUND";
          break;
        case 409:
          customError.message = serverMessage || "Correo o Telefono se encuentra en uso.";
          customError.type = "CONFLICT";
          break;
        case 422:
          customError.message = serverMessage || "Datos de entrada inválidos.";
          customError.type = "VALIDATION_ERROR";
          break;
        case 500:
          customError.message = "Error interno del servidor. Intenta más tarde.";
          customError.type = "SERVER_ERROR";
          break;
        case 503:
          customError.message = "Servicio no disponible temporalmente.";
          customError.type = "SERVICE_UNAVAILABLE";
          break;
        default:
          customError.message = serverMessage || `Error del servidor (${status})`;
          customError.type = "UNKNOWN";
      }
      

      customError.response = error.response;
    }
    

    customError.originalError = error;
    customError.request = error.request;
    
    return Promise.reject(customError);
  }
);


export const API = {

  auth: {
    login: (credentials) => axiosInstance.post("/api/auth/login", credentials),
    register: (userData) => axiosInstance.post("/api/auth/register", userData),
    validateToken: (token) =>
      axiosInstance.post("/api/auth/validate-token", null, {
        headers: { Authorization: `Bearer ${token}` },
      }),
  },


  consumidor: {
    setImagen: (id, imagen) => {
      const formData = new FormData();
      formData.append("imagen", imagen);
      return axiosInstance.post(
        `/api/consumidores/${id}/establecerImagen`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
    },
    crearTelefono: (idConsumidor, telefonoData) =>
      axiosInstance.post(
        `/api/consumidores/${idConsumidor}/crearTelefono`,
        telefonoData
      ),
    crearDireccion: (id, direccion) =>
      axiosInstance.post(`/api/consumidores/${id}/crearDireccion`, direccion),
    getProductos: (idConsumidor) =>
      axiosInstance.get(`/api/consumidores/${idConsumidor}/productos/todos`),
    getProducto: (idConsumidor, idProducto) =>
      axiosInstance.get(
        `/api/consumidores/${idConsumidor}/productos/${idProducto}`
      ),
    agregarAlCarrito: (idConsumidor, idProducto, cantidad) =>
      axiosInstance.post(
        `/api/consumidores/${idConsumidor}/carrito/agregar/${idProducto}`,
        { cantidad }
      ),
    getCarrito: (idConsumidor) =>
      axiosInstance.get(`/api/consumidores/${idConsumidor}/carrito`),
    eliminarDelCarrito: (idConsumidor, idProducto) =>
      axiosInstance.delete(
        `/api/consumidores/${idConsumidor}/carrito/eliminar/${idProducto}`
      ),
    limpiarCarrito: (idConsumidor) =>
      axiosInstance.delete(`/api/consumidores/${idConsumidor}/carrito/limpiar`),
    actualizarCantidad: (idConsumidor, idProducto, cantidad) =>
      axiosInstance.put(
        `/api/consumidores/${idConsumidor}/carrito/actualizar/${idProducto}`,
        { cantidad }
      ),
    crearOrden: (id, orden) =>
      axiosInstance.post(`/api/consumidores/${id}/carrito/ordenar`, orden),
    cancelarOrden: (idConsumidor, idOrden) =>
      axiosInstance.post(
        `/api/consumidores/${idConsumidor}/ordenes/${idOrden}/cancelar`
      ),
  },

  comerciante: {
    completarRegistro: (id, formData, token) => {
      return axiosInstance.post(
        `/api/comerciantes/${id}/completarRegistro`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
    },

    crearProducto: async (idComerciante, formData) => {

      const token = await AsyncStorage.getItem('token');
      
      return axiosInstance.post(
        `/api/comerciantes/${idComerciante}/crearProducto`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        }
      );
    },
    setImagen: (id, imagen) => {
      const formData = new FormData();
      formData.append("imagen", imagen);
      return axiosInstance.post(
        `/api/comerciantes/${id}/establecerImagen`,
        formData
      );
    },
    crearTelefono: (id, telefono, token) =>
      axiosInstance.post(`/api/comerciantes/${id}/crearTelefono`, telefono),
    getProductos: (idComerciante) =>
      axiosInstance.get(`/api/comerciantes/${idComerciante}/productos/todos`),
    getProducto: (idComerciante, idProducto) =>
      axiosInstance.get(
        `/api/comerciantes/${idComerciante}/productos/${idProducto}`
      ),
    getOrdenes: (id) =>
      axiosInstance.get(`/api/comerciantes/${id}/ordenes/todos`),
    getOrden: (idComerciante, idOrden) =>
      axiosInstance.get(
        `/api/comerciantes/${idComerciante}/ordenes/${idOrden}`
      ),
    confirmarOrden: (idComerciante, idOrden) =>
      axiosInstance.post(
        `/api/comerciantes/${idComerciante}/ordenes/${idOrden}/confirmar`
      ),
    getOrdenesPreparacion: (id) =>
      axiosInstance.get(`/api/comerciantes/${id}/ordenes/preparacion`),
    getOrdenPreparacion: (idComerciante, idOrden) =>
      axiosInstance.get(
        `/api/comerciantes/${idComerciante}/ordenes/preparacion/${idOrden}`
      ),
  },

  admin: {
    getConsumidores: () => axiosInstance.get("/api/admin/consumidores/todos"),
    getConsumidor: (id) => axiosInstance.get(`/api/admin/consumidores/${id}`),
    getComerciantes: () => axiosInstance.get("/api/admin/comerciantes/todos"),
    getComerciante: (id) => axiosInstance.get(`/api/admin/comerciantes/${id}`),
  },
};

export default axiosInstance;