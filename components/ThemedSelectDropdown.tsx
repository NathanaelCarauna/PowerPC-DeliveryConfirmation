import React, { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, TouchableOpacity, View, FlatList } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Entypo } from '@expo/vector-icons';

export type SelectItem = {
  label: string;
  value: string;
};

export type ThemedSelectDropdownProps = {
  lightColor?: string;
  darkColor?: string;
  selectedValue: string;
  onValueChange: (itemValue: string) => void;
  items: SelectItem[];
};

export function ThemedSelectDropdown({
  lightColor,
  darkColor,
  selectedValue,
  onValueChange,
  items,
}: ThemedSelectDropdownProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
  
  const [modalVisible, setModalVisible] = useState(false);

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
          {items.find(item => item.value === selectedValue)?.label || 'Selecione uma opção'}
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
                data={items}
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
