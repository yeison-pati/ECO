// Componente ProductSection
// Este componente representa una sección de productos en una vista de tipo catálogo.
// Muestra un título de categoría y una lista horizontal de productos usando el componente ProductCard.

// Importación de componentes de React Native
import { View, Text, FlatList, StyleSheet } from 'react-native';

//Importación de componente personalizado
import ProductCard from './ProductCard';

// Props:
// - title: El título que representa la categoría o tipo de productos que se están mostrando.
// - products: Un arreglo de objetos que representan los productos. 
export default function ProductSection ({ title, products }) {
    
    return (
        <View style={styles.section}>

            {/* Título de la sección */}
            <Text style={styles.title}>{title}</Text>

             {/* Lista de productos en formato horizontal */}
            <FlatList
                data={products}
                horizontal
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => (

                    // Renderiza un ProductCard por cada producto                    
                    <ProductCard 
                        key={item.idProducto?.toString()} 
                        id={item.idProducto} 
                        nombre={item.nombre} 
                        precio={item.precio} 
                        imagen={item.imagen} 
                    />
                )}
                keyExtractor={(item, index) => 
                    item.idProducto?.toString() ?? index.toString()} // Toma el idProducto de la BD Si item.idProducto no existe o es null o undefined, entonces usa el index (la posición del item en la lista)
            />
        </View>
    );
};


//Estilos delcomponente
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