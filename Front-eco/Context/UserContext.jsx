// Archivo: /Context/UserContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppNavigation } from '../app/hooks/useAppNavigation';
import axiosLogin from '../routes/axiosLogin';

// Crear el contexto
const UserContext = createContext();

// Hook personalizado para usar el contexto
export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser debe ser usado dentro de un UserProvider');
    }
    return context;
};

// Proveedor del contexto
export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Datos temporales durante el registro
    const [registroTemporal, setRegistroTemporal] = useState(null);

    const navigate = useAppNavigation();

    // Cargar el estado de autenticación al iniciar
    useEffect(() => {
        loadAuthState();
    }, []);

    // Función para limpiar errores
    const clearError = () => {
        setError(null);
    };

    // Función para almacenar datos temporales durante el registro
    const setUsuario = (userData) => {
        console.log("Guardando datos temporales:", userData);
        setRegistroTemporal(userData);
    };

    // Obtener datos temporales de registro
    const getUsuario = () => {
        return registroTemporal;
    };
    
    // Función para iniciar sesión
    const login = async (correo, contrasena) => {
        try {
            setLoading(true);
            setError(null); // Limpiar errores previos
            
            const response = await axiosLogin(correo, contrasena);
            
            console.log("Datos de respuesta login:", response);
            
            // Verificar que la respuesta contiene los campos necesarios
            if (!response || !response.token || !response.idUsuario) {
                throw new Error("Respuesta de login incompleta del servidor");
            }
            
            // Guardar datos en AsyncStorage
            await AsyncStorage.setItem('token', response.token);
            await AsyncStorage.setItem('user', JSON.stringify(response));
            
            // Actualizar estado
            setToken(response.token);
            setUser(response);
            
            return response;

        } catch (error) {
            console.error('Error completo en login:', error);
            
            // Determinar el mensaje de error apropiado
            let errorMessage = 'Error al iniciar sesión';
            
            if (error.response) {
                // Error de respuesta del servidor
                switch (error.response.status) {
                    case 401:
                        errorMessage = 'Credenciales incorrectas. Verifica tu correo y contraseña.';
                        break;
                    case 404:
                        errorMessage = 'Usuario no encontrado.';
                        break;
                    case 500:
                        errorMessage = 'Error interno del servidor. Intenta más tarde.';
                        break;
                    default:
                        errorMessage = error.response.data?.message || 'Error del servidor';
                }
            } else if (error.request) {
                // Error de red
                errorMessage = 'Sin conexión al servidor. Verifica tu conexión a internet.';
            } else {
                // Otros errores
                errorMessage = error.message || 'Error inesperado';
            }
            
            setError(errorMessage);
            throw new Error(errorMessage); // Propagar el error para que el componente lo pueda manejar
        } finally {
            setLoading(false);
        }
    };

    const loadAuthState = async () => {
        try {
            const storedToken = await AsyncStorage.getItem('token');
            const storedUser = await AsyncStorage.getItem('user');
            
            if (storedToken && storedUser) {
                try {
                    const parsedUser = JSON.parse(storedUser);
                    setToken(storedToken);
                    setUser(parsedUser);
                } catch (parseError) {
                    console.error('Error parseando datos del usuario:', parseError);
                    // Si hay error de parseo, limpiamos el storage
                    await AsyncStorage.removeItem('token');
                    await AsyncStorage.removeItem('user');
                    setError('Error al cargar datos de usuario');
                }
            }
        } catch (error) {
            console.error('Error al cargar el estado:', error);
            setError('Error al cargar el estado de autenticación');
        } finally {
            setLoading(false);
        }
    };

    // Función para cerrar sesión
    const logout = async () => {
        try {
            setLoading(true);
            console.log("Cerrando sesión...");
            // Limpiar AsyncStorage
            await AsyncStorage.removeItem('token');
            await AsyncStorage.removeItem('user');
            
            // Limpiar estado
            setToken(null);
            setUser(null);
            setError(null);
            
            console.log("Navegando al inicio después de cerrar sesión");
            // Navegar al inicio
            navigate.toIndex();
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
            setError('Error al cerrar sesión');
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Función para verificar si el usuario está autenticado
    const isAuthenticated = () => {
        return !!token;
    };

    // Función para obtener el token
    const getToken = () => {
        return token;
    };

    // Función para actualizar los datos del usuario
    const updateUserData = async (newUserData) => {
        try {
            await AsyncStorage.setItem('user', JSON.stringify(newUserData));
            setUser(newUserData);
        } catch (error) {
            console.error('Error al actualizar datos del usuario:', error);
            setError('Error al actualizar datos del usuario');
            throw error;
        }
    };

    const value = {
        user,
        token,
        loading,
        error,
        login,
        logout,
        isAuthenticated,
        getToken,
        updateUserData,
        clearError, // Agregar función para limpiar errores
        // Datos temporales del registro
        usuario: registroTemporal,
        setUsuario,
        getUsuario
    };

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
};