// components/DocumentPickerButton.js
import React from 'react';
import { View, Button, Text } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';

export default function DocumentPickerButton({ documento, setDocumento }) {
  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        multiple: false,
        type: 'application/pdf', // Especificamos que solo queremos archivos PDF
        copyToCacheDirectory: false
      });
      
      console.log(result.assets[0]);
    
        if (!result.canceled) {
          setDocumento(result.assets[0]);

      } else {
        // El usuario canceló la selección o no seleccionó un PDF
        console.log('Selección de documento cancelada o no es un PDF');
        setDocumento(null); // Limpiar el estado si no se selecciona un PDF
      }
    } catch (err) {
      console.log('Error al seleccionar el documento:', err);
      setDocumento(null); // Limpiar el estado en caso de error
    }
  };

  return (
    <View style={{ alignItems: 'center', marginVertical: 10 }}>
      <Button title="PDF" onPress={pickDocument} />
    </View>
  );
}