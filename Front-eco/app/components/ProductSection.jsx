




import { View, Text, FlatList, StyleSheet } from 'react-native';


import ProductCard from './ProductCard';




export default function ProductSection ({ title, products }) {
    
    return (
        <View style={styles.section}>
            
            <Text style={styles.title}>{title}</Text>

            <FlatList
                data={products}
                horizontal
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => (


                    <ProductCard 
                        key={item.idProducto?.toString()} 
                        id={item.idProducto} 
                        nombre={item.nombre} 
                        precio={item.precio} 
                        imagen={item.imagen} 
                    />
                )}
                keyExtractor={(item, index) => 
                    item.idProducto?.toString() ?? index.toString()}
            />
        </View>
    );
};



const styles = StyleSheet.create({
    section: {
        marginVertical: 10,
        marginLeft: 20,
    },
    title: {
        fontWeight: 'bold',
        fontSize: 20,
        marginBottom: 25,
        marginTop: 20,
    },
});