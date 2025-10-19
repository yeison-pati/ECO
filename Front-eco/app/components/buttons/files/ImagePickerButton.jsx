import React, { useState } from 'react';
import { View, Button, Image, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
// ⚠️ importa tu OverBottom (ajusta la ruta según tu estructura)
import OverBottom from '../../alerts/OverBottom'; 

export default function ImagePickerButton({ imagen, setImagen, testID }) {

  const [error, setError] = useState(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images', 'videos'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true,
    });

    if (!result.canceled) {
      console.log('Expo image picker:', result.assets[0]);
      setImagen(result.assets[0]);
    }
  };

  const handleChange = (e) => {
    const isCypress = typeof window !== 'undefined' && window.Cypress;
    if (!isCypress) return;

    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Formato de imagen incorrecto');
      e.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Data = reader.result;
      const simulatedAsset = {
        uri: base64Data,
        file,
        fileName: file.name,
        fileSize: file.size,
        type: file.type.startsWith('image') ? 'image' : 'video',
        mimeType: file.type,
        width: 768,
        height: 395,
      };

      console.log('Cypress simulated image picker:', simulatedAsset);
      setImagen(simulatedAsset);
    };

    reader.readAsDataURL(file);
  };

  return (
    <View style={{ alignItems: 'center', marginVertical: 10 }}>
      {Platform.OS === 'web' ? (
        <label
          htmlFor={testID}
          style={{
            display: 'inline-block',
            backgroundColor: '#007bff',
            color: 'white',
            padding: 10,
            borderRadius: 5,
            cursor: 'pointer',
            textAlign: 'center',
            width: 200,
          }}
        >
          Seleccionar imagen
          <input
            id={testID}
            data-testid={testID}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onClick={(e) => {
              const isCypress = typeof window !== 'undefined' && window.Cypress;
              if (!isCypress) {
                e.preventDefault();
                pickImage();
              }
            }}
            onChange={handleChange}
          />
        </label>
      ) : (
        <Button title="Seleccionar imagen" onPress={pickImage} testID={testID} />
      )}

      {imagen && (
        <Image
          source={{ uri: imagen.uri }}
          style={{
            width: 200,
            height: 200,
            marginTop: 10,
            borderRadius: 10,
          }}
        />
      )}

      {/* ⚠️ AQUÍ se renderiza el OverBottom si hay error */}
      {error && (
        <OverBottom
          title="ERROR AL SELECCIONAR IMAGEN"
          message={error}
          onPress={() => setError(null)}
        />
      )}
    </View>
  );
}
