import React, { useState } from 'react';
import { GestureResponderEvent, StyleSheet, View, TextInput, Keyboard } from 'react-native';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { CustomButton } from "@/components/CustomButtom";
import LogoBackground from "@/components/LogoBackground";
import { ThemedTable } from "@/components/ThemedTable";
import { ThemedText } from "@/components/ThemedText";
import { ThemedInputText } from "@/components/ThemedTextInput";
import { ThemedView } from "@/components/ThemedView";
import { useRouter } from "expo-router";

const sampleData = [
  { id: '1', pedido: 'Pedido 001', data: '01/08/2024', status: 'Entregue' },
  { id: '2', pedido: 'Pedido 002', data: '02/08/2024', status: 'Pendente' },
  { id: '3', pedido: 'Pedido 003', data: '03/08/2024', status: 'Cancelado' },
];

export default function Home() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState<any[]>([]);

  const handleSearch = () => {
    const result = sampleData.filter(
      item => item.pedido.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Verifica se o item já está na lista acumulada antes de adicionar
    const newItems = result.filter(item => !filteredData.some(data => data.id === item.id));

    // Adiciona os novos itens à lista acumulada
    setFilteredData([...filteredData, ...newItems]);
    setSearchQuery(''); // Limpa o campo de busca
    Keyboard.dismiss(); // Fecha o teclado
  };

  const handleRemoveItem = (id: string) => {
    setFilteredData(filteredData.filter(item => item.id !== id));
  };

  function handlePress(event: GestureResponderEvent): void {
    console.log("Login button pressed");
    router.push('/filialSelection');
  }

  const handleBarcodeScan = () => {
    console.log("Barcode scan clicked");
    // Implement barcode scan functionality here
  };

  return (
    <ThemedView style={styles.container}>
      <LogoBackground />
      <ThemedView style={styles.searchContainer}>
        <MaterialCommunityIcons
          name="barcode-scan"
          size={20}
          color="black"
          onPress={handleBarcodeScan}
          style={styles.icon}
        />
        <ThemedInputText
          style={styles.input}
          placeholder="Buscar pedido"
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch} // Aciona a busca ao pressionar Enter
        />
        <MaterialIcons
          name="search"
          size={20}
          color="black"
          onPress={handleSearch} // Aciona a busca ao pressionar o ícone de lupa
          style={styles.searchIcon}
        />
      </ThemedView>

      <ThemedView style={styles.content}>
        <ThemedTable data={filteredData} onRemoveItem={handleRemoveItem} />
        <CustomButton title="Entregar" onPress={handlePress} />
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 15,
  },
  searchContainer: {
    marginTop: '60%',
    flexDirection: 'row',
    alignItems: 'center',
    width: '80%',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    padding: 4,
    backgroundColor: 'white',
  },
  input: {
    flexGrow: 1,
    borderBottomWidth: 0,
    paddingVertical: 0,
    marginBottom: -1,
  },
  searchIcon: {
    marginLeft: 5,
  },
  icon: {
    marginRight: 5,
  },
  content: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: 'transparent',
  },
});
