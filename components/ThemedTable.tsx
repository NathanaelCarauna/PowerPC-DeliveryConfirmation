import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

type TableRow = {
  id: string;
  pedido: string;
  data: string;
};

type ThemedTableProps = {
  data: TableRow[];
  onRemoveItem: (id: string) => void;
};

export function ThemedTable({ data, onRemoveItem }: ThemedTableProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Pedido</Text>
        <Text style={styles.headerText}>Data</Text>
        <Text style={styles.headerText}>Operações</Text>
      </View>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.cell}>{item.pedido}</Text>
            <Text style={styles.cell}>{item.data}</Text>
            <View style={styles.operationsCell}>
              <TouchableOpacity onPress={() => console.log('Foto clicada para', item.pedido)}>
                <MaterialIcons name="photo-camera" size={20} color="black" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => onRemoveItem(item.id)}>
                <MaterialIcons name="delete" size={20} color="red" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 10,
    backgroundColor: 'white',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  headerText: {
    flex: 1,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    padding: 10,
  },
  cell: {
    flex: 1,
    textAlign: 'center',
    color: '#333',
  },
  operationsCell: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    flex: 1,
  },
});
