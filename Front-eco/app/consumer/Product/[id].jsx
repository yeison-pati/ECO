import { View, Text, Image, ScrollView, StyleSheet, ActivityIndicator, SafeAreaView } from 'react-native';
import { useEffect, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { useUser } from '../../../Context/UserContext';
import axiosProductoPorId from '../../../routes/axiosProductoPorId';
import { fixImageUrl } from '../../../utils/fixImageUrl';
import { formatPrice } from '../../../utils/formatPrice';
import BackButton from '../../components/buttons/behavorial/BackButton';
import QuantitySelector from '../../components/QuantitySelector';
import AddToCartButton from '../../components/AddToCartButton';

export default function ProductDetails() {
    const { id } = useLocalSearchParams();
    const { user } = useUser();
    const insets = useSafeAreaInsets();

    const [producto, setProducto] = useState(null);
    const [loading, setLoading] = useState(true);
    const [cantidad, setCantidad] = useState(1);

    useEffect(() => {
        if (!user?.id) return;

        const obtenerProducto = async () => {
            try {
                const data = await axiosProductoPorId(user.id, id);
                setProducto(data);
            } catch (error) {
                console.error('Error al obtener el producto:', error);
            } finally {
                setLoading(false);
            }
        };

        obtenerProducto();
    }, [id, user?.id]);

    if (loading) {
        return <ActivityIndicator size="large" color="#617957" style={{ flex: 1, justifyContent: 'center' }} />;
    }

    if (!producto) {
        return (
            <SafeAreaView style={[styles.safeArea, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
                <View style={styles.container}>
                    <BackButton />
                    <Text style={styles.error}>Producto no encontrado</Text>
                </View>
            </SafeAreaView>
        );
    }

    const { nombre, precio, descripcion, imagen } = producto;

    return (
        <SafeAreaView style={[styles.safeArea, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
            <View style={styles.container}>
                <BackButton />

                <View style={styles.header}>
                    <Image
                        source={{ uri: fixImageUrl(imagen) }}
                        style={styles.image}
                    />
                </View>

                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.infoWrapper}>
                        <Text style={styles.name}>{nombre}</Text>

                        <View style={styles.priceWrapper}>
                            <Text style={styles.price}>${formatPrice(precio)}</Text>
                            <QuantitySelector style={styles.selector}
                                cantidad={cantidad}
                                onQuantityChange={setCantidad}
                            />
                        </View>

                        <Text style={styles.detailsTitle}>Detalles</Text>
                        <Text style={styles.description}>{descripcion}</Text>
                    </View>
                </ScrollView>

                <View style={styles.footer}>
                    <AddToCartButton idProducto={id} cantidad={cantidad} />
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
    },
    header: {
        backgroundColor: '#F7B29D80',
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
    error: {
        fontSize: 20,
        textAlign: 'center',
        color: '#93181B',
        marginTop: 50,
    },
});