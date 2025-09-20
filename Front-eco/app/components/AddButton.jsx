// Componente AddButton
// Representa un botón redondo que muestra un ícono de "agregar".
// Al presionar el botón, se ejecuta una función que recibe como prop.

// Importaciones componentes de React Native
import { StyleSheet, View, Image, TouchableOpacity } from 'react-native'

// Props:
// - size: tamaño del botón e ícono (valor por defecto: 30)
// - onPress: función que se ejecuta al presionar el botón
export default function AddButton ({ size = 30, onPress }) {
  return (
    <View>

      {/* Botón táctil */}
      <TouchableOpacity style={styles.button(size)} onPress={onPress}>

            {/* Fondo interno del botón */}
            <View style={styles.background(size)}>

                {/* Imagen del ícono de "agregar" */}
                <Image 
                    source={require('../../assets/icons/agregar.png')}
                    style={styles.image(size)}
                />
            </View>
        </TouchableOpacity>
    </View>
  )
}

//Estilos del componente
const styles = StyleSheet.create({
    background: (size) => ({
      backgroundColor: '#FFFEF5',
      padding: 5,
    }),

    button: (size) => ({
      width: size + 2,
      height: size + 2,
      borderRadius: (size + 2) / 2, // Hace el botón redondo
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden',
    }),

    image: (size) =>({
        width: size, 
        height: size
    }),
  });
  