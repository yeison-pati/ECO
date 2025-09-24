

 

import { StyleSheet, Text, View } from 'react-native'


import { formatPrice } from '../../utils/formatPrice'



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