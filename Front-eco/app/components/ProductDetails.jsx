import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { formatPrice } from '../../utils/formatPrice';
import { useAppNavigation } from '../hooks/useAppNavigation';

export default function ProductDetails({ product }) {
    const navigate = useAppNavigation();

    return (
        <ScrollView style={styles.container}>
            <View style={styles.imageContainer}>
                <Image source={{ uri: product.imagen }} style={styles.image} />
            </View>
            
            <View style={styles.detailsContainer}>
                <Text style={styles.name}>{product.nombre}</Text>
                <Text style={styles.price}>{formatPrice(product.precio)}</Text>
                
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Descripción</Text>
                    <Text style={styles.description}>{product.descripcion}</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Información del Vendedor</Text>
                    <TouchableOpacity 
                        style={styles.sellerInfo}
                        onPress={() => navigate.toSellerProfile(product.vendedor_id)}
                    >
                        <Text style={styles.sellerName}>{product.nombre_vendedor}</Text>
                        <Text style={styles.sellerLocation}>{product.ubicacion}</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity 
                    style={styles.contactButton}
                    onPress={() => navigate.toChat(product.vendedor_id)}
                >
                    <Text style={styles.contactButtonText}>Contactar al Vendedor</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    imageContainer: {
        width: '100%',
        height: 300,
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    detailsContainer: {
        padding: 20,
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    price: {
        fontSize: 20,
        color: '#617957',
        fontWeight: 'bold',
        marginBottom: 20,
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    description: {
        fontSize: 16,
        lineHeight: 24,
        color: '#666',
    },
    sellerInfo: {
        backgroundColor: '#f5f5f5',
        padding: 15,
        borderRadius: 10,
    },
    sellerName: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    sellerLocation: {
        fontSize: 14,
        color: '#666',
    },
    contactButton: {
        backgroundColor: '#617957',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 20,
    },
    contactButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
}); 