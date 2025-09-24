
import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppNavigation } from '../app/hooks/useAppNavigation';
import axiosLogin from '../routes/axiosLogin';


const UserContext = createContext();


export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser debe ser usado dentro de un UserProvider');
    }
    return context;
};


export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    const [registroTemporal, setRegistroTemporal] = useState(null);

    const navigate = useAppNavigation();


    useEffect(() => {
        loadAuthState();
    }, []);


    const clearError = () => {
        setError(null);
    };


    const setUsuario = (userData) => {
        console.log("Guardando datos temporales:", userData);
        setRegistroTemporal(userData);
    };


    const getUsuario = () => {
        return registroTemporal;
    };
    

    const login = async (correo, contrasena) => {
        try {
            setLoading(true);
            setError(null);
            
            const response = await axiosLogin(correo, contrasena);
            
            console.log("Datos de respuesta login:", response);
            

            if (!response || !response.token || !response.idUsuario) {
                throw new Error("Respuesta de login incompleta del servidor");
            }
            

            await AsyncStorage.setItem('token', response.token);
            await AsyncStorage.setItem('user', JSON.stringify(response));
            

            setToken(response.token);
            setUser(response);
            
            return response;

        } catch (error) {
            console.error('Error completo en login:', error);
            

            let errorMessage = 'Error al iniciar sesión';
            
            if (error.response) {

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

                errorMessage = 'Sin conexión al servidor. Verifica tu conexión a internet.';
            } else {

                errorMessage = error.message || 'Error inesperado';
            }
            
            setError(errorMessage);
            throw new Error(errorMessage);
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


    const logout = async () => {
        try {
            setLoading(true);
            console.log("Cerrando sesión...");

            await AsyncStorage.removeItem('token');
            await AsyncStorage.removeItem('user');
            

            setToken(null);
            setUser(null);
            setError(null);
            
            console.log("Navegando al inicio después de cerrar sesión");

            navigate.toIndex();
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
            setError('Error al cerrar sesión');
            throw error;
        } finally {
            setLoading(false);
        }
    };


    const isAuthenticated = () => {
        return !!token;
    };


    const getToken = () => {
        return token;
    };


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
        clearError,

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