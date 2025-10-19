import { Text, StyleSheet } from "react-native";

export default function Font({ testID, mensage, variant, size, Color, style }) {
    const getFontStyle = () => {
        switch (variant.toLowerCase()) {
          case 'bold':
            return styles.bold;
          case 'semibold':
            return styles.semiBold;
          case 'medium':
            return styles.medium;
          case 'extrabold':
            return styles.extraBold;
          default:
            return styles.regular;
        }
      };
    
      return (
        <Text testID={testID} style={[getFontStyle(), { fontSize: size, color: Color }, style]}>
          {mensage}
        </Text>
      );
    

}
const styles = StyleSheet.create({
    regular: {
      fontWeight: '400',
    },
    bold: {
      fontWeight: 'bold',
    },
    semiBold: {
      fontWeight: '600',
    },
    medium: {
      fontWeight: '500',
    },
    extraBold: {
      fontWeight: '800',
    },
  });
  