



import { TouchableOpacity, Text,  StyleSheet } from 'react-native'
import { useAppNavigation } from '../hooks/useAppNavigation';

export default function AddMoreProductsButton ({ testID }) {
    const navigate = useAppNavigation();

    return (
        <TouchableOpacity
          testID={testID}
          style={styles.addMoreButton}
          onPress={navigate.toConsumerHome}
          accessibilityRole="button"
          accessibilityLabel="add-more-products"
        > 
            <Text style={styles.addMoreText}>+ Añadir más productos</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    addMoreButton: {
        marginTop: 10,
        marginBottom: 10,
    },
    addMoreText: {
        color: '#254D25',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
