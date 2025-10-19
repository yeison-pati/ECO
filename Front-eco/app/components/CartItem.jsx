import { View, Text, Image, StyleSheet } from 'react-native';


import QuantitySelector from '../components/QuantitySelector';
import DeleteCartButton from '../components/DeleteCartButton';


import { formatPrice } from '../../utils/formatPrice';
import { fixImageUrl } from '../../utils/fixImageUrl';
import axios from 'axios';
import axiosEliminarProductoDelCarrito from '../../routes/axiosEliminarProductoDelCarrito';






export default function CartItem({ item, onDelete, onQuantityUpdate, userId }) {

    const handleCantidadChange = (nuevaCantidad) => {
        onQuantityUpdate(item.id, nuevaCantidad);
    };

    const handleOneDelete = async () => {
        try {
            await axiosEliminarProductoDelCarrito(userId, item.id);
            onDelete(item.id); // solo si backend responde bien
        } catch {
            Alert.alert('Error', 'No se pudo eliminar el producto');
        }
    }

    return (
        <View
            testID={`cart-item-${item.id}`}
            style={styles.cartItem}>

            <Image
                testID={`cart-product-image-${item.id}`}
                source={{ uri: fixImageUrl(item.imagen) }} style={styles.productImage}
            />

            <View style={styles.productInfo}>
                <Text
                    testID={`cart-product-name-${item.id}`}
                    style={styles.productName}>{item.nombre}
                </Text>
                <Text
                    testID={`cart-product-price-${item.id}`}
                    style={styles.productPrice}>${formatPrice(item.precio)}
                </Text>

                <QuantitySelector
                    testID='qs'
                    style={styles.selector}
                    cantidad={item.cantidad}
                    onQuantityChange={handleCantidadChange}
                />
            </View>

            <DeleteCartButton onPress={handleOneDelete} />
        </View>
    );
}

const styles = StyleSheet.create({
    cartItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    productImage: {
        width: 70,
        height: 70,
        borderRadius: 10,
        marginRight: 10,
    },
    productInfo: {
        flex: 1,
    },
    productName: {
        fontWeight: 'bold',
        fontSize: 14,
        marginBottom: 5,
    },
    productPrice: {
        color: '#617957',
        fontWeight: 'bold',
        marginBottom: 5,
    },
    selector: {
        flexDirection: 'row',
        alignItems: 'center',
        fontSize: 12,
    },
});