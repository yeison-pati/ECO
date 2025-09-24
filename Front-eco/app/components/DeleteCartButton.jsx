




import { TouchableOpacity, Image, Alert } from 'react-native';


import axiosEliminarProductoDelCarrito from '../../routes/axiosEliminarProductoDelCarrito';




export default function DeleteCartButton({ idProducto, onSuccess }) {

  const handleDelete = async () => {
    try {

      await axiosEliminarProductoDelCarrito(idProducto);


      Alert.alert('Éxito', 'Producto eliminado del carrito');
      
      if (onSuccess) onSuccess();
      
    } catch (error) {


      Alert.alert('Error', 'No se pudo eliminar el producto');
    }
  };
  
  return (

    <TouchableOpacity onPress={handleDelete}>
      <Image 
        source={require('../../assets/icons/remove.png')} 
        style={styles.removeIcon} 
      />
    </TouchableOpacity>
  );
}


const styles = {
  removeIcon: {
    width: 25,
    height: 25,
    resizeMode: 'contain',
    marginLeft: 10,
  }
};