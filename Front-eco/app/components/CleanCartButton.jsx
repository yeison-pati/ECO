import { TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';

export default function CleanCartButton ({ onPress }) {

  return (
    <TouchableOpacity
      testID="clean-cart-button"
      style={styles.cleanButton}
      onPress={onPress}
    >
      <Image source={require('../../assets/icons/cleanCart.png')} style={styles.cleanIcon} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cleanButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 1,
    width: 45,
    height: 45,
  },
  cleanIcon: {
    width: 45,
    height: 45,
    resizeMode: 'contain',
  },
});