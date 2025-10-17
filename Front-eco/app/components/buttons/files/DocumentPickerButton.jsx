
import React from 'react';
import { View, Button } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';

export default function DocumentPickerButton({ documento, setDocumento, testID }) {
  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        multiple: false,
        type: 'application/pdf',
        copyToCacheDirectory: false
      });
      
      console.log(result.assets?.[0]);
    
      if (!result.canceled) {
        setDocumento(result.assets[0]);
      } else {
        console.log('Selección de documento cancelada o no es un PDF');
        setDocumento(null);
      }
    } catch (err) {
      console.log('Error al seleccionar el documento:', err);
      setDocumento(null);
    }
  };

  return (
    <View style={{ alignItems: 'center', marginVertical: 10 }}>
      <Button title="PDF" onPress={pickDocument} testID={testID} />
    </View>
  );
}