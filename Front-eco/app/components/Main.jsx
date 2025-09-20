import {View, StyleSheet} from 'react-native';
import Circle from './figures/Circle';
import Logo from './figures/Logo';
import { useSafeAreaInsets } from 'react-native-safe-area-context'; //Descargar con npx install react-native-safe-area-context

export function Main() {

    // Obtiene los márgenes seguros del dispositivo (top, bottom, etc.)
    const insets = useSafeAreaInsets();
    
  return (

    // View externa con padding dinámico en la parte superior e inferior según el dispositivo
    <View style={[styleSheet.root, {paddingTop: insets.top, paddingBottom: insets.bottom}]}>
      <View>
        <Circle size={250} top={-0.68} right={-0.85} />
        <Circle size={400} bottom={-0.8} left={-1} />
      </View>
      <View style={style.logoContainer}>
        <Logo size={400}/>
      </View>
    </View>
  );
}

export default Main;

const style = StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: '#E54C4D',
    },
    logoContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
  