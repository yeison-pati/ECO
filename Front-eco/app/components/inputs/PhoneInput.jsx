import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Modal, FlatList } from 'react-native';
import Font from '../aesthetic/Font';
import { COUNTRIES } from '../../data/countries';

const PhoneInput = ({ 
  indicativoValue, 
  numeroValue, 
  onIndicativoChange, 
  onNumeroChange, 
  indicativoError, 
  numeroError,
  indicativoRef,
  numeroRef,
  onSubmitEditing
}) => {
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[41]);

  React.useEffect(() => {
    if (!indicativoValue) {
      onIndicativoChange(selectedCountry.dialCode);
    }
  }, []);

  const onSelectCountry = (country) => {
    setSelectedCountry(country);
    onIndicativoChange(country.dialCode);
    setShowCountryPicker(false);
    
    if (numeroRef && numeroRef.current) {
      numeroRef.current.focus();
    }
  };

  const renderCountryItem = ({ item }) => (
    <TouchableOpacity
      style={styles.countryItem}
      onPress={() => onSelectCountry(item)}
    >
      <Font
        mensage={`${item.name} (+${item.dialCode})`}
        variant="regular"
        size={16}
        Color="#05130A"
      />
    </TouchableOpacity>
  );

  return (
    <View>
      <View style={styles.containernumero}>
        <TouchableOpacity 
          style={[styles.input, styles.inputCodigoPais]}
          onPress={() => setShowCountryPicker(true)}
        >
          <Font
            mensage={`+${indicativoValue || selectedCountry.dialCode}`}
            variant="regular"
            size={16}
            Color="#05130A"
          />
        </TouchableOpacity>
        <TextInput
          style={[styles.input, styles.inputnumero]}
          value={numeroValue}
          onChangeText={onNumeroChange}
          ref={numeroRef}
          placeholder="1234567890"
          keyboardType="phone-pad"
          maxLength={10}
          onSubmitEditing={onSubmitEditing}
        />
      </View>

      {/* Mostrar errores en la misma estructura que los inputs */}
      {(indicativoError || numeroError) && (
        <View style={styles.errorRow}>
          <View style={styles.errorIndicativo}>
            {indicativoError && (
              <Font
                mensage={indicativoError}
                variant="semiBold"
                size={14}
                Color="red"
                style={{marginTop: 5 }}
              />
            )}
          </View>
          <View style={styles.errorNumero}>
            {numeroError && (
              <Font
                mensage={numeroError}
                variant="semiBold"
                size={14}
                Color="red"
                style={{marginTop: 5 }}
              />
            )}
          </View>
        </View>
      )}

      <Modal
        visible={showCountryPicker}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowCountryPicker(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Font
                mensage="Seleccionar País"
                variant="bold"
                size={20}
                Color="#05130A"
              />
              <TouchableOpacity
                onPress={() => setShowCountryPicker(false)}
                style={styles.closeButton}
              >
                <Font
                  mensage="Cerrar"
                  variant="semiBold"
                  size={16}
                  Color="#05130A"
                />
              </TouchableOpacity>
            </View>
            <FlatList
              data={COUNTRIES}
              renderItem={renderCountryItem}
              keyExtractor={(item) => item.code}
              style={styles.countryList}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  containernumero: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginVertical: 10,
  },
  input: {
    backgroundColor: '#FFFFFF',
    height: 54,
    paddingHorizontal: 20,
    borderRadius: 57,
    borderColor: '#ccc',
    borderWidth: 1,
    fontSize: 16,
  },
  inputCodigoPais: {
    flex: 1,
    marginRight: 5,
    justifyContent: 'center',
  },
  inputnumero: {
    flex: 2,
    marginLeft: 5,
  },

  errorRow: {
    flexDirection: 'row',
    marginHorizontal: 20,
  },
  errorIndicativo: {
    flex: 1,
    marginRight: 5,
    paddingLeft: 20,
  },
  errorNumero: {
    flex: 2,
    marginLeft: 5,
    paddingLeft: 20,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  closeButton: {
    padding: 10,
  },
  countryList: {
    maxHeight: 400,
  },
  countryItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
});

export default PhoneInput;