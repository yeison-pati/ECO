import { View, Text, Image, StyleSheet } from 'react-native';

// Componentes personalizados
import QuantitySelector from '../components/QuantitySelector';
import DeleteCartButton from '../components/DeleteCartButton';

// Utilidades
import { formatPrice } from '../../utils/formatPrice';
import { fixImageUrl } from '../../utils/fixImageUrl';

// Props:
// - item: Producto del carrito (con .id, .nombre, .precio, .cantidad, .imagen)
// - onDelete: función para eliminar el producto (se usa en DeleteCartButton)
// - onQuantityUpdate: función que recibe nueva cantidad -> Cart se actualiza

export default function CartItem({ item, onDelete, onQuantityUpdate }) {
    const handleCantidadChange = (nuevaCantidad) => {
        onQuantityUpdate(item.id, nuevaCantidad);
    };

    return (
        <View style={styles.cartItem}>
            {/**/}
            <Image source={{ uri: fixImageUrl(item.imagen) }} style={styles.productImage} />

            <View style={styles.productInfo}>
                <Text style={styles.productName}>{item.nombre}</Text>
                <Text style={styles.productPrice}>${formatPrice(item.precio)}</Text>

                <QuantitySelector
                    style={styles.selector}
                    cantidad={item.cantidad}
                    onQuantityChange={handleCantidadChange}
                />
            </View>

            <DeleteCartButton
                idProducto={item.id}
                onSuccess={onDelete}
            />
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