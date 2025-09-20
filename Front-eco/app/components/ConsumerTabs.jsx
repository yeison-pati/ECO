// Componente ConsumerTabs
// Navegador de pestañas inferior que permite al consumidor navegar entre las pantallas principales (Inicio y Carrito).
// Usa íconos personalizados y estilos adaptados al diseño de la app.

//Importaciones de componentes de React Native y librerías
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image, View,  StyleSheet } from 'react-native';

// Vistas principales
import Home from '../consumer/Home';
import Cart from '../consumer/Cart';

// Iconos personalizados para las tabs
import homeIcon from '../../assets/icons/home.png';
import cartIcon from '../../assets/icons/carrito.png';

// Crear el navegador de pestañas inferiores
const Tab = createBottomTabNavigator();

export default function ConsumerTabs () {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({

         /*
         * Define cómo se debe mostrar el ícono de cada pestaña.
         * - `focused`: indica si la pestaña está activa.
         * - `size` y `color`: vienen del sistema de navegación.
         * - Se usan íconos personalizados pasados por `initialParams` en cada Tab.Screen.
         */
        
        tabBarIcon: ({ color, size, focused }) => {  
          const iconSource = route.params?.icon; // Icono personalizado por cada ruta

          return (        
          <View style={styles.circle(size, focused)}>
              <Image
                source={iconSource}
                style={styles.icon(size, focused, color)}
              />
          </View>
          );
        },

        tabBarShowLabel: false, // Oculta el nombre debajo de los íconos

        // Estilos generales para la barra de navegación
        tabBarStyle: {
          backgroundColor: '#FFC5B3',
          height: 60,
          paddingBottom: 10,
        },

        headerShown: false, // Oculta la cabecera superior (header) en las vistas hijas
      })}
    >
      {/* Pantalla de Inicio*/}
      <Tab.Screen
        name="Inicio"
        component={Home}
        initialParams={{ icon: homeIcon }}
      />

      {/* Pantalla de Carrito*/}
      <Tab.Screen
        name="Carrito"
        component={Cart}
        initialParams={{ icon: cartIcon }}
      />
    </Tab.Navigator>
  );
}

//Estilos del componente
const styles = StyleSheet.create({
    circle: (size, focused) => ({
      width: size + 20,
      height: size + 20,
      borderRadius: (size + 20) / 2,
      backgroundColor: focused ? '#CC444180' : 'transparent', // Cambiar el color del circulo si el icono está seleccionado
      justifyContent: 'center',
      alignItems: 'center',
      marginTop:10,
    }),
    icon: (size, focused, color) => ({
      width: size,
      height: size,
      tintColor: focused ? '#000000' : color, // Cambiar el color del icono si está seleccionado
    }),
  });