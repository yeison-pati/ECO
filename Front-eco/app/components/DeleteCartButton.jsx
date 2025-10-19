import { TouchableOpacity, Image, Alert } from 'react-native';

  export default function DeleteCartButton({ onPress }) {
  return (
    <TouchableOpacity
      testID="delete-cart-button"
      onPress={onPress}
    >
      <Image source={require('../../assets/icons/remove.png')} style={styles.removeIcon} />
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