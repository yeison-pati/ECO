// Home
// Pantalla principal del usuario consumidor. Muestra un banner promocional 
// y una lista de secciones de productos agrupados por tipo.

//Importaciones de componentes de React Native y librerías
import { StyleSheet, View, ScrollView } from "react-native"
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useEffect, useState } from "react";

// Importación de la función que llama al backend para listar todos los productos
import axiosProductos from "../../routes/axiosProductos";

// Importación de la función que corrige las URLs de imágenes locales
import { fixImageUrl } from '../../utils/fixImageUrl';

// Componentes personalizados
import PromoBanner from "../components/PromoBanner";
import ProductSection from "../components/ProductSection";
import { useUser } from '../../Context/UserContext';
import LogoutButton from '../components/buttons/behavorial/LogOutbutton';

export default function Home(){
    const { user, setUsuario } = useUser();
    
    const insets = useSafeAreaInsets(); // Hook que obtiene los márgenes seguros del dispositivo (top, bottom, etc.)
    const [productos, setProductos] = useState([]); // Estado que guarda todos los productos obtenidos del backend

    // useEffect para manejar la actualización del usuario
    useEffect(() => {
        setUsuario(null);
    }, []);

    // useEffect que obtiene los productos una vez al montar el componente
    useEffect(() => {
        if (!user) return;
        const intentoDeUsoAxios = async () => {
            try {
                const respuestaDeAxios = await axiosProductos(user.idUsuario);
                setProductos(respuestaDeAxios);
                
            } catch (error) {
                console.error('Error al obtener productos:', error);
            }
        };
        intentoDeUsoAxios();
    }, [user]);

    // Agrupar productos por tipo (ej: "bebidas", "snacks", etc.)
    const productosPorTipo = productos.reduce((acc, producto) => {
        const tipo = producto.tipo || "Otros"; // Si no tiene tipo, se asigna "Otros"

        if (!acc[tipo]) {
            acc[tipo] = [];
        }

        // Se agrega el producto, corrigiendo la URL de la imagen
        acc[tipo].push({
            ...producto,
            imagen: fixImageUrl(producto.imagen)
        });

        return acc;
    }, {});

    return (
        <>
            { /* Contenedor principal padding superior e inferior basado en los insets del dispositivo */}
            <View style={[styles.root, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
                <ScrollView>
                    {/* Banner promocional en la parte superior */}
                    <PromoBanner />
                    
                    {/* Sección para cada tipo de producto */}
                    {Object.entries(productosPorTipo).map(([tipo, productosDelTipo]) => (
                        <ProductSection key={tipo} title={tipo} products={productosDelTipo} />
                    ))}
                    

                </ScrollView>
                <LogoutButton/>
            </View>
        </>
    )
}

//Estilos de la pantalla
const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: '#FEF3EF',
        marginTop: 10,
    },
  });