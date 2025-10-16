import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useAppNavigation } from '../hooks/useAppNavigation';

export default function SellerProfile({ seller }) {
    const navigate = useAppNavigation();

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Image source={{ uri: seller.imagen_perfil }} style={styles.profileImage} />
                <Text style={styles.name}>{seller.nombre}</Text>
                <Text style={styles.location}>{seller.ubicacion}</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Sobre el Vendedor</Text>
                <Text style={styles.description}>{seller.descripcion}</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Productos</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.productsContainer}>
                    {seller.productos.map(product => (
                        <TouchableOpacity 
                            key={product.id}
                            style={styles.productCard}
                            onPress={() => navigate.toProductDetails(product.id)}
                        >
                            <Image source={{ uri: product.imagen }} style={styles.productImage} />
                            <Text style={styles.productName}>{product.nombre}</Text>
                            <Text style={styles.productPrice}>{product.precio}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            <TouchableOpacity 
                style={styles.contactButton}
                onPress={() => navigate.toChat(seller.id)}
            >
                <Text style={styles.contactButtonText}>Contactar al Vendedor</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 10,
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    location: {
        fontSize: 16,
        color: '#666',
    },
    section: {
        padding: 20,
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
    productsContainer: {
        marginTop: 10,
    },
    productCard: {
        width: 150,
        marginRight: 15,
        backgroundColor: '#f5f5f5',
        borderRadius: 10,
        padding: 10,
    },
    productImage: {
        width: '100%',
        height: 100,
        borderRadius: 5,
        marginBottom: 10,
    },
    productName: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    productPrice: {
        fontSize: 14,
        color: '#617957',
        fontWeight: 'bold',
    },
    contactButton: {
        backgroundColor: '#617957',
        margin: 20,
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    contactButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
}); 