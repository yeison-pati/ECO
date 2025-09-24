




import { StyleSheet, View, ScrollView } from "react-native"
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useEffect, useState } from "react";


import axiosProductos from "../../routes/axiosProductos";


import { fixImageUrl } from '../../utils/fixImageUrl';


import PromoBanner from "../components/PromoBanner";
import ProductSection from "../components/ProductSection";
import { useUser } from '../../Context/UserContext';
import LogoutButton from '../components/buttons/behavorial/LogOutbutton';

export default function Home(){
    const { user, setUsuario } = useUser();
    
    const insets = useSafeAreaInsets();
    const [productos, setProductos] = useState([]);


    useEffect(() => {
        setUsuario(null);
    }, []);


    useEffect(() => {
        if (!user) return;
        const intentoDeUsoAxios = async () => {
            try {
                const respuestaDeAxios = await axiosProductos(user.idUsuario);
                setProductos(respuestaDeAxios);
                
            } catch (error) {
                console.error('Error al obtener productos:', error);
            }
        };
        intentoDeUsoAxios();
    }, [user]);


    const productosPorTipo = productos.reduce((acc, producto) => {
        const tipo = producto.tipo || "Otros";

        if (!acc[tipo]) {
            acc[tipo] = [];
        }


        acc[tipo].push({
            ...producto,
            imagen: fixImageUrl(producto.imagen)
        });

        return acc;
    }, {});

    return (
        
            <View style={[styles.root, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
                <ScrollView>
                
                    <PromoBanner />
                    
                    {Object.entries(productosPorTipo).map(([tipo, productosDelTipo]) => (
                        <ProductSection key={tipo} title={tipo} products={productosDelTipo} />
                    ))}
                    

                </ScrollView>
                <LogoutButton/>
            </View>
    )
}


const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: '#FEF3EF',
        marginTop: 10,
    },
  });