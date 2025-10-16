



import { View, Image, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { formatPrice } from '../../utils/formatPrice';
import { useAppNavigation } from '../hooks/useAppNavigation';






export default function ProductCard({ id, nombre, precio, imagen }) {
    const navigate = useAppNavigation();

    return (
        <TouchableOpacity 
            style={styles.card} 
            onPress={() => navigate.toProductDetails(id)}
        >
            <View style={styles.content}>
                <View style={styles.rectangulo}>
                    <Image source={{ uri: imagen }} style={styles.image} />
                    <Text style={styles.name}>{nombre}</Text>
                    <Text style={styles.price}>{formatPrice(precio)}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}


const styles = StyleSheet.create({
    card: {
        backgroundColor: '#F7E1AF80',
        borderRadius: 20,
        width: 120,
        marginRight: 10,
        padding: 10,
        alignItems: 'center',
    },
    content: {
        alignItems: 'center',
        flexDirection: 'column',
        gap: 8,
    },
    rectangulo: {
        backgroundColor: '#FFFFFF80',
        borderRadius: 20,
        width: 105,
        padding: 10,
        alignItems: 'center',
    },
    image: {
        width: 60,
        height: 60,
        marginBottom: 10,
        borderRadius: 30,
    },
    name: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    price: {
        fontSize: 12,
        color: '#617957',
        fontWeight: 'bold',
    },
});