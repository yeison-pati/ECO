import { Tabs } from 'expo-router/tabs';
import { Image, View, StyleSheet } from 'react-native';
import homeIcon from '../../assets/icons/home.png';
import cartIcon from '../../assets/icons/carrito.png';

export default function ConsumerLayout() {
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
            <View style={styles.circle(size, focused)}>
              <Image
                source={homeIcon}
                style={styles.icon(size, focused)}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="Cart"
        options={{
          tabBarIcon: ({ focused, size }) => (
            <View style={styles.circle(size, focused)}>
              <Image
                source={cartIcon}
                style={styles.icon(size, focused)}
              />
            </View>
          ),
        }}
      />
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