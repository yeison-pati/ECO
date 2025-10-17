



import { TouchableOpacity, Text,  StyleSheet } from 'react-native'
import { useAppNavigation } from '../hooks/useAppNavigation';

export default function ProceedButton({ cartData, testID }) {
    const navigate = useAppNavigation();

    const handlePress = () => {
        navigate.toPayment(cartData.total);
    };

    return (
        <TouchableOpacity
          testID={testID}
          style={styles.proceedButton}
          onPress={handlePress}
          accessibilityRole="button"
          accessibilityLabel="proceed"
        >
            <Text style={styles.proceedButtonText}>Proceder</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    proceedButton: {
        marginVertical: 20,
        backgroundColor: '#A5D0A3',
        paddingVertical: 10,
        borderRadius: 25,
        alignItems: 'center',
    },
    proceedButtonText: {
        color: '#000000',
        fontWeight: 'bold',
        fontSize: 20,
    },
});