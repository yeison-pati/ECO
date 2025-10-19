import { Tabs } from 'expo-router/tabs';
import { Image, View, StyleSheet } from 'react-native';
import homeIcon from '../../assets/icons/home.png';
import ordersIcon from '../../assets/icons/tiempo-pasado.png';
import userIcon from '../../assets/icons/usuario.png';

export default function CommerceLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: '#FFC5B3',
          height: 60,
          paddingBottom: 10,
        },
        tabBarShowLabel: false,
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="Home"
        options={{
          tabBarIcon: ({ focused, size }) => (
            <View style={styles.circle(size, focused)}
            >
              <Image
                source={homeIcon}
                style={styles.icon(size, focused)}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="Orders"
        options={{
          tabBarIcon: ({ focused, size }) => (
            <View style={styles.circle(size, focused)}>
              <Image
                source={ordersIcon}
                style={styles.icon(size, focused)}
              />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="Profile"
        options={{
          tabBarIcon: ({ focused, size }) => (
            <View style={styles.circle(size, focused)}>
              <Image source={userIcon} style={styles.icon(size, focused)} />
            </View>
          ),
        }}
      />


      {/* Rutas del mismo folder que NO deben ser tabs */}
      <Tabs.Screen name="AddProduct" options={{ href: null }} />
      <Tabs.Screen name="Product/[id]" options={{ href: null }} />
      <Tabs.Screen name="Product/index" options={{ href: null }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  circle: (size, focused) => ({
    width: size + 20,
    height: size + 20,
    borderRadius: (size + 20) / 2,
    backgroundColor: focused ? '#CC444180' : 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  }),
  icon: (size, focused) => ({
    width: size,
    height: size,
    tintColor: focused ? '#000000' : '#666',
  }),
});