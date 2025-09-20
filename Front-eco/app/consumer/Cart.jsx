import { View, Text, SafeAreaView, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppNavigation } from '../hooks/useAppNavigation';
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';

import axiosCarrito from '../../routes/axiosCarrito';
import BackButton from '../components/buttons/behavorial/BackButton';
import CartItem from '../components/CartItem';
import CleanCartButton from '../components/CleanCartButton';
import AddMoreProductsButton from '../components/AddMoreProductsButton';
import ProceedButton from '../components/ProceedButton';
import TotalCard from '../components/TotalCard';

export default function Cart() {
    const navigate = useAppNavigation(); // Permite redireccionar a otras pantallas
    const router = useRouter(); // Router de expo para los listeners
    const insets = useSafeAreaInsets(); // Obtiene los márgenes seguros del dispositivo

    // Estado que guarda los productos del carrito y el total
    const [cartData, setCartData] = useState({
        productos: [],
        total: 0
    });

    // Estado para mostrar spinner de carga mientras se obtiene el carrito
    const [loading, setLoading] = useState(true);

    // Función asincrónica que obtiene el carrito del backend
    const fetchCart = async () => {
        try {
            setLoading(true); // Muestra el ActivityIndicator
            const data = await axiosCarrito(); // Llama al servidor
            setCartData(data); // Actualiza los productos y el total
        } catch (error) {
            console.error('Error al obtener el carrito:', error);
            setCartData({ productos: [], total: 0 }); // Limpia si falla
        } finally {
            setLoading(false); // Oculta el indicador de carga
        }
    };

    // Ejecuta fetchCart cuando la pantalla es enfocada o abierta
    useEffect(() => {
        // Este listener se activa cada vez que la pantalla es enfocada (cuando la pantalla actual es visible o se vuelve a abrir).
        // El 'focus' es un evento que se dispara cuando la pantalla es visitada o regresa al primer plano.
        const unsubscribe = router.addListener('focus', fetchCart);

        // También ejecuta fetchCart una vez al montar el componente. Esto asegura que los datos del carrito se obtengan cuando la pantalla se muestra por primera vez.
        fetchCart(); // Llama a la función fetchCart para obtener los datos del carrito cuando la pantalla se muestra por primera vez.

        // Retorna la función `unsubscribe` que se encarga de limpiar (remover) el listener cuando el componente se destruye (desmonta).
        // De esta manera, evitamos posibles fugas de memoria o múltiples llamadas al mismo evento `focus` si el componente se monta y desmonta repetidamente.
        return unsubscribe; // Esta línea limpia el listener 'focus' cuando el componente se destruye.
    }, [router]); // El hook `useEffect` depende de `router`, así que se ejecutará cada vez que este objeto cambie.

    // Función que calcula el total sumando precio * cantidad por producto
    const calcularNuevoTotal = (productos) => {
        return productos.reduce((acc, prod) => acc + (prod.precio * prod.cantidad), 0);
    };

    // Elimina un producto del carrito usando su ID
    const handleDelete = (idProducto) => {
        setCartData(prevData => {
            const nuevosProductos = prevData.productos.filter(p => p.id !== idProducto);
            return {
                productos: nuevosProductos,
                total: calcularNuevoTotal(nuevosProductos)
            };
        });
    };

    // Actualiza la cantidad de un producto en el carrito
    const handleQuantityUpdate = (idProducto, nuevaCantidad) => {
        setCartData(prevData => {
            const nuevosProductos = prevData.productos.map(prod =>
                prod.id === idProducto ? { ...prod, cantidad: nuevaCantidad } : prod
            );
            return {
                productos: nuevosProductos,
                total: calcularNuevoTotal(nuevosProductos)
            };
        });
    };

    // Mientras se está cargando, muestra un spinner
    if (loading) {
        return <ActivityIndicator size="large" color="#617957" style={{ flex: 1, justifyContent: 'center' }} />;
    }

    // Renderizado principal del componente
    return (
        <SafeAreaView style={[styles.safeArea, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
            
            {/* Botones superiores: Limpiar carrito y regresar */}
            <View style={styles.buttonContainer}>
                    <CleanCartButton onSuccess={fetchCart} />
                    <BackButton />
            </View>
            
            <View style={styles.container}>    

                {/* Título principal */}
                <Text style={styles.title}>Mi orden</Text>

                {/* Lista de productos en el carrito */}
                <ScrollView style={styles.cartList} showsVerticalScrollIndicator={false}>
                    {cartData.productos.map((item) => (
                        <CartItem
                            key={item.id}
                            item={item}
                            onDelete={() => handleDelete(item.id)}
                            onQuantityUpdate={handleQuantityUpdate}
                        />
                    ))}
                </ScrollView>

                {/* Parte inferior: botones y total */}
                <View style={styles.bottomSection}>
                    <AddMoreProductsButton />
                    <View style={styles.summary}>
                        <TotalCard total={cartData.total} />
                        <ProceedButton cartData={cartData}/>
                    </View>
                    
                </View>
            </View>
        </SafeAreaView>
    );
}


const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#FEF3EF',
    },
    container: {
        flex: 1,
        paddingHorizontal: 20,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 80,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#050505',
    },
    cartList: {
        flexGrow: 1,
    },
    bottomSection: {
        paddingVertical: 10,
    },
    summary: {
        paddingTop: 10,
        borderTopWidth: 1,
        borderColor: '#000000',
    },
});
