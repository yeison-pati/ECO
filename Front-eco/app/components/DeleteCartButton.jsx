// Componente DeleteCartButton
// Botón que permite al usuario eliminar un producto específico del carrito.
// Usa una alerta para confirmar la eliminación y actualiza la vista.

//Importación de componentes de React Native
import { TouchableOpacity, Image, Alert } from 'react-native';

// Importación de la función que llama al backend para eliminar un producto del carrito
import axiosEliminarProductoDelCarrito from '../../routes/axiosEliminarProductoDelCarrito';

// Props:
// - idProducto: ID del producto que se desea eliminar del carrito.
// - onSuccess: Función que se ejecuta tras eliminar el producto exitosamente para actualizar la pantalla
export default function DeleteCartButton({ idProducto, onSuccess }) {

  const handleDelete = async () => {
    try {
       // Llama al backend para eliminar el producto del carrito
      await axiosEliminarProductoDelCarrito(idProducto);

      // Notifica al usuario que la acción fue exitosa
      Alert.alert('Éxito', 'Producto eliminado del carrito');
      
      if (onSuccess) onSuccess();
      
    } catch (error) {

      // Muestra alerta de error si la petición falla
      Alert.alert('Error', 'No se pudo eliminar el producto');
    }
  };
  
  return (
    // Botón táctil que activa la función de eliminar
    <TouchableOpacity onPress={handleDelete}>
      <Image 
        source={require('../../assets/icons/remove.png')} 
        style={styles.removeIcon} 
      />
    </TouchableOpacity>
  );
}

//Estilos del componente
const styles = {
  removeIcon: {
    width: 25,
    height: 25,
    resizeMode: 'contain',
    marginLeft: 10,
  }
};