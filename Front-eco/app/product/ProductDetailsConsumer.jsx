// ProductDetailsConsumer
// Pantalla de detalles de un producto individual. Se encarga de obtener los datos
// desde el backend según el `id` recibido desde la navegación, mostrar los detalles
// del producto (nombre, imagen, precio, descripción) y permitir al usuario
// seleccionar una cantidad y agregarlo al carrito.

// Importaciones de componentes de React Native y librerías
import { View, Text, Image, ScrollView, StyleSheet, ActivityIndicator, SafeAreaView } from 'react-native';
import { useEffect, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context'; 
import { useAppNavigation } from '../hooks/useAppNavigation';

//Importaciones de funciones
import axiosProductoPorId from '../../routes/axiosProductoPorId'; // Llama al backend para obtener los datos del producto seleccionado
import { fixImageUrl } from '../../utils/fixImageUrl'; //Arregla el URL de las imágenes
import {formatPrice} from '../../utils/formatPrice'; // Formatea precios (ej: 50000 => 50.000)

//Importaciones de componentes personalizados
import BackButton from '../components/buttons/behavorial/BackButton';
import QuantitySelector from '../components/QuantitySelector';
import AddToCartButton from '../components/AddToCartButton';

// Props:
// route: Objeto que contiene el ID del producto del cual se muestran los detalles.
export default function ProductDetailsConsumer({ route }) {
    const { id } = route.params; //El id viene de ProductCard
    const insets = useSafeAreaInsets(); // Hook que obtiene los márgenes seguros del dispositivo (top, bottom, etc.)
    const navigate = useAppNavigation();

    const [producto, setProducto] = useState(null); // Estado para detalles del producto
    const [loading, setLoading] = useState(true); // Estado para el indicador de carga
    const [cantidad, setCantidad] = useState(1); // Estado para la cantidad

    // Al cargar la pantalla, obtenemos los datos del producto
    useEffect(() => {
        const obtenerProducto = async () => {
            try {
                const data = await axiosProductoPorId(id);  // Llama al backend
                setProducto(data);                          // Guarda los datos
            } catch (error) {
                console.error('Error al obtener el producto:', error);
            } finally {
                setLoading(false);                           // Oculta el spinner
            }
        };

        obtenerProducto();
    }, [id]);

    // Mientras esta cargando muestra un spinner
    if (loading) {
        return <ActivityIndicator size="large" color="#617957" style={{ flex: 1, justifyContent: 'center' }} />;
    }

    // Desestructuramos los datos del producto
    const { nombre, precio, descripcion, imagen } = producto;


    return (
        <SafeAreaView style={[styles.safeArea, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
            <View style={styles.container}>

                {/* Botón de regreso en la esquina superior izquierda */}
                <BackButton />

                {/* Contenedor con la imagen del producto */}
                <View style={styles.header}>
                    <Image 
                        source={{ uri: fixImageUrl(imagen) }}
                        style={styles.image} 
                    />
                </View>

                {/* Scroll para el contenido del producto */}
                <ScrollView 
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Contenedor con información del producto */}
                    <View style={styles.infoWrapper}>

                            {/* Nombre del producto */}
                            <Text style={styles.name}>{nombre}</Text>
                            
                            {/* Contenedor de precio */}
                            <View style={styles.priceWrapper}>

                                {/* Precio */}
                                <Text style={styles.price}>${formatPrice(precio)}</Text>

                                {/* Botones para seleccionar la cantidad */}
                                <QuantitySelector style={styles.selector} 
                                    cantidad={1}  
                                    onQuantityChange={setCantidad}  
                                />
                            </View>

                            {/* Descripción del producto */}
                            <Text style={styles.detailsTitle}>Detalles</Text>
                            <Text style={styles.description}>{descripcion}</Text>
                    </View>
                </ScrollView>
                
                {/* Botón fijo para agregar el producto al carrito */}
                <View style={styles.footer}>
                    <AddToCartButton idProducto={id} cantidad={cantidad} producto={producto}/> {/* Pasamos el id del producto actual y la cantidad seleccionada*/}
                </View>

            </View>
        </SafeAreaView>
    );
}

//Estilos de la pantalla 
const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#FEF3EF', // Fondos general
    },
    container: {
        flex: 1,
    },
    header: {
        backgroundColor: '#F7B29D80', // Fondo rosa en la parte superior
        paddingVertical: 10,
        borderRadius: 20,
        alignItems: 'center',
    },
    image: {
        width: '80%',
        height: 250,
        borderRadius: 10,
        resizeMode: "cover",
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'flex-start',
        paddingHorizontal: 20,
    },
    infoWrapper: {
        width: '100%',
        marginTop: 20,
    },
    name: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#93181B',
        textAlign: 'left',
        marginBottom: 10,
    },
    price: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#DF3F32',
        marginVertical: 10,
    },
    priceWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    selector: {
        backgroundColor: '#F7B29D99',
    },
    detailsTitle: {
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#050505',
    },
    description: {
        fontSize: 20,
        textAlign: 'justify',
        color: '#050505',
    },
    footer: {
        padding: 10,
        width: '100%',
        alignItems: 'center',
    },
});