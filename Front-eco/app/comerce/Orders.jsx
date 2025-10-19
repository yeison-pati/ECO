import { StyleSheet, View, Text, ScrollView } from "react-native"
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useEffect, useState } from "react";


import axiosProductos from "../../routes/axiosProductos";


import { fixImageUrl } from '../../utils/fixImageUrl';


import PromoBanner from "../components/PromoBanner";
import ProductSection from "../components/ProductSection";
import { useUser } from '../../Context/UserContext';
import LogoutButton from '../components/buttons/behavorial/LogOutbutton';

export default function Orders() {
  return (
    <View>
      <Text>Orders Screen</Text>
    </View>
  );
}
