// Componente AddMoreProductsButton
// Botón que permite al usuario navegar de vuelta al inicio para añadir más productos.

//Importaciones de componentes de React Native y librerías
import { TouchableOpacity, Text,  StyleSheet } from 'react-native'
import { useAppNavigation } from '../hooks/useAppNavigation';

export default function AddMoreProductsButton () {
    const navigate = useAppNavigation(); // Obtiene el objeto de navegación

    return (
        // Botón táctil que navega al 'Inicio' (Home dentro del Tab Navigator)
        // Importante: Navegamos al 'Inicio' del Tab para mantener visible el menú de navegación inferior
        <TouchableOpacity style={styles.addMoreButton} onPress={navigate.toConsumerHome}> 
            <Text style={styles.addMoreText}>+ Añadir más productos</Text>
        </TouchableOpacity>
    )
}

//Estilos del componente
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
