import { View, Text, SafeAreaView, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppNavigation } from '../hooks/useAppNavigation';
import { useEffect, useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useUser } from '../../Context/UserContext';

import axiosCarrito from '../../routes/axiosCarrito';
import BackButton from '../components/buttons/behavorial/BackButton';
import CartItem from '../components/CartItem';
import CleanCartButton from '../components/CleanCartButton';
import AddMoreProductsButton from '../components/AddMoreProductsButton';
import ProceedButton from '../components/ProceedButton';
import TotalCard from '../components/TotalCard';

export default function Cart() {
    const navigate = useAppNavigation();
    const { user } = useUser();
    const insets = useSafeAreaInsets();


    const [cartData, setCartData] = useState({
        productos: [],
        total: 0
    });


    const [loading, setLoading] = useState(true);


    const fetchCart = async () => {
        if (!user?.idUsuario) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const data = await axiosCarrito(user.idUsuario);
            setCartData(data);
        } catch (error) {
            console.error('Error al obtener el carrito:', error);
            setCartData({ productos: [], total: 0 });
        } finally {
            setLoading(false);
        }
    };


    useFocusEffect(
        useCallback(() => {
            fetchCart();
        }, [user])
    );


    const calcularNuevoTotal = (productos) => {
        return productos.reduce((acc, prod) => acc + (prod.precio * prod.cantidad), 0);
    };


    const handleDelete = (idProducto) => {
        setCartData(prevData => {
            const nuevosProductos = prevData.productos.filter(p => p.id !== idProducto);
            return {
                productos: nuevosProductos,
                total: calcularNuevoTotal(nuevosProductos)
            };
        });
    };


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


    if (loading) {
        return <ActivityIndicator size="large" color="#617957" style={{ flex: 1, justifyContent: 'center' }} />;
    }

    if (!user) {
        return (
            <SafeAreaView style={[styles.safeArea, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
                <View style={styles.container}>
                    <BackButton />
                    <Text style={styles.error}>Inicia sesión para ver el carrito</Text>
                </View>
            </SafeAreaView>
        );
    }

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
