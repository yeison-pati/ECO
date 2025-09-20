// Componente ProceedButton
// Botón que permite al usuario pasar del carrito a la spantalla para confirmar la orden

//Importación de componentes de React Native y librerías
import { TouchableOpacity, Text,  StyleSheet } from 'react-native'
import { useAppNavigation } from '../hooks/useAppNavigation';

export default function ProceedButton({cartData}) {
    const navigate = useAppNavigation(); // Hook de navegación

    // Navega a la pantalla para confirmar laorden
    const handlePress = () => {
        navigate.toPayment(cartData.total);
    };

    return (
        <TouchableOpacity style={styles.proceedButton} onPress={handlePress}>
            <Text style={styles.proceedButtonText}>Proceder</Text>
        </TouchableOpacity>
    )
}

//Estilos del componente
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