import { View, Image, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useAppNavigation } from '../hooks/useAppNavigation';
import { formatPrice } from '../../utils/formatPrice';
import AddButton from './AddButton';
import {fixImageUrl} from "../../utils/fixImageUrl";








export default function ComerceProductCard({ id, nombre, precio, imagen, onPress }) {
    const navigate = useAppNavigation();

    const handlePress = () => {
        if (onPress) {
            onPress(id);
        } else {
            navigate.toProductDetails(id);
        }
    };

    return (
        <View style={styles.card}>
            <View style={styles.content}>
                <View style={styles.rectangulo}>
                    <Image source={{ uri: fixImageUrl(imagen) }} style={styles.image} />
                    <Text style={styles.name} numberOfLines={1}>{nombre}</Text>
                    <Text style={styles.price}>
                        {precio !== undefined ? `$${formatPrice(precio)}` : 'Sin precio'}
                    </Text>
                </View>

                <AddButton size={24} onPress={handlePress} iconSource={require('../../assets/icons/Edit.png')}/>
            </View>
        </View>
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