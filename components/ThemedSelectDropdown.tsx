import React, { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, TouchableOpacity, View, FlatList } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Entypo } from '@expo/vector-icons';

export type ThemedSelectDropdownProps = {
  lightColor?: string;
  darkColor?: string;
  selectedValue: string;
  onValueChange: (itemValue: string) => void;
};

export function ThemedSelectDropdown({
  lightColor,
  darkColor,
  selectedValue,
  onValueChange,
}: ThemedSelectDropdownProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
  
  const [modalVisible, setModalVisible] = useState(false);

  // Mock data for branches (filiais)
  const filialOptions = [
    { label: 'Filial 1', value: '1' },
    { label: 'Filial 2', value: '2' },
    { label: 'Filial 3', value: '3' },
    { label: 'Filial 4', value: '4' },
    { label: 'Filial 5', value: '5' },
    { label: 'Filial 6', value: '6' },
    { label: 'Filial 7', value: '7' },
    { label: 'Filial 8', value: '8' },
    { label: 'Filial 9', value: '9' },
    { label: 'Filial 10', value: '10' },
    { label: 'Filial 11', value: '11' },
    { label: 'Filial 12', value: '12' },
    { label: 'Filial 13', value: '13' },
    { label: 'Filial 14', value: '14' },
    { label: 'Filial 15', value: '15' },
    { label: 'Filial 16', value: '16' },
    { label: 'Filial 17', value: '17' },
    { label: 'Filial 18', value: '18' },
    { label: 'Filial 19', value: '19' },
    { label: 'Filial 20', value: '20' },
  ];

  const handleSelect = (value: string) => {
    onValueChange(value);
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Pressable 
        style={styles.selectButton} 
        onPress={() => setModalVisible(true)}
      >
        <Text style={[styles.selectText, { color }]}>
          {filialOptions.find(option => option.value === selectedValue)?.label || 'Select an option'}
        </Text>
        <Entypo name="chevron-down" size={20} color={color} />
      </Pressable>
      
      {modalVisible && (
        <Modal
          transparent={true}
          animationType="slide"
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <FlatList 
                data={filialOptions}
                keyExtractor={(item) => item.value}
                renderItem={({ item }) => (
                  <TouchableOpacity 
                    style={styles.modalItem} 
                    onPress={() => handleSelect(item.value)}
                  >
                    <Text style={styles.modalItemText}>{item.label}</Text>
                  </TouchableOpacity>
                )}
              />
              <TouchableOpacity 
                style={styles.modalCloseButton} 
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalCloseButtonText}>Fechar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
    width: '100%',
  },
  selectButton: {
    borderBottomWidth: 1,
    borderColor: 'gray',
    paddingVertical: 10,
    paddingHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    
    alignItems: 'center',
  },
  selectText: {
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '60%',
    maxHeight: '50%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,    
  },
  modalItem: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    width: '100%',
  },
  modalItemText: {
    fontSize: 18,
  },
  modalCloseButton: {
    marginTop: 20,
    backgroundColor: '#007bff',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  modalCloseButtonText: {
    color: 'white',
    fontSize: 16,
  },
});
