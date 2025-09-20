import { View, Text, Image, ScrollView, StyleSheet } from 'react-native';

const promoImages = [
    require('../../assets/images/Frispicada.png'),
    require('../../assets/images/BigBox.png'),
];

const PromoBanner = () => {
    return (
        <View style={styles.banner}>
            <Text style={styles.title}>¡Descuento Especial!</Text>
            <Text style={styles.subtitle}>Ahorra hasta un 40%</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageRow}>
                {promoImages.map((img, index) => (
                    <Image key={index} source={img} style={styles.foodImage} />
                ))}
            </ScrollView>
        </View>
    );
};

export default PromoBanner;

const styles = StyleSheet.create({
    banner: {
        backgroundColor: '#FFE6D5',
        marginHorizontal: 20,
        borderRadius: 50,
        padding: 15,
    },
    title: {
        fontSize: 15,
        color: '#000000',
        marginLeft: 20,
    },
    subtitle: {
        fontWeight: 'bold',
        fontSize: 20,
        marginBottom: 10,
        color: '#000000',
        marginLeft: 20,
    },
    imageRow: {
        flexDirection: 'row',
        marginLeft: 20,
    },
    foodImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginHorizontal: 5,
    },
});