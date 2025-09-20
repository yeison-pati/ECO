// Componente TotalCard
// Card que muestra el total a pagar del carrito de compras. Formatea el número recibido como precio.
 
//Importación de componentes de React Native
import { StyleSheet, Text, View } from 'react-native'

//Importación de función que formatea precios (ej: 50000 => 50.000)
import { formatPrice } from '../../utils/formatPrice'

//  Props:
//  - total: Valor total del carrito (viene del backend).
export default function TotalCard ({total}) {
    return (
            <View style={styles.summaryRow}>
                {/* Etiqueta "Total" */}
                <Text style={styles.totalText}>Total</Text>

                {/* Precio total */}
                <Text style={styles.total}>${formatPrice(total)}</Text>
            </View>
    )
}


//Estilos del componente
const styles = StyleSheet.create({
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 5,
    },
    totalText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    total: {
        color: '#9B8F8F',
        fontSize: 20,
    },
})