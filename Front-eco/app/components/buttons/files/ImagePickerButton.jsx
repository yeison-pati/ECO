// components/ImagePickerButton.js
// components/ImagePickerButton.js
import React from 'react';
import { View, Button, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function ImagePickerButton({ imagen, setImagen }) {
    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ['images', 'videos'],
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });
    
        console.log(result.assets[0]);
    
        if (!result.canceled) {
          setImagen(result.assets[0]);
        }
      }

    return (
        <View style={{ alignItems: 'center', marginVertical: 10 }}>
            <Button title="Seleccionar imagen" onPress={pickImage} />
            {imagen && (
                <Image
                    source={{ uri: imagen.uri }}
                    style={{ width: 200, height: 200, marginTop: 10, borderRadius: 10 }}
                />
            )}
        </View>
    );
}
