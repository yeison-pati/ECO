




import { StyleSheet, View, Image, TouchableOpacity } from 'react-native'




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


const styles = StyleSheet.create({
    background: (size) => ({
      backgroundColor: '#FFFEF5',
      padding: 5,
    }),

    button: (size) => ({
      width: size + 2,
      height: size + 2,
      borderRadius: (size + 2) / 2,
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden',
    }),

    image: (size) =>({
        width: size, 
        height: size
    }),
  });
  