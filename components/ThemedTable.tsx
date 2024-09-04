import React from 'react';
import { FlatList, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Pedido } from '@/app/context/appContext';


type ThemedTableProps = {
  data: Pedido[];
  onRemoveItem: (id: number) => void;
};

export function ThemedTable({ data, onRemoveItem }: ThemedTableProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.headerText, styles.idColumn]}>Pedido</Text>
        <Text style={[styles.headerText, styles.clientColumn]}>Cliente</Text>
        <Text style={[styles.headerText, styles.dateColumn]}>Data</Text>
        <Text style={[styles.headerText, styles.operationsColumn]}>Operações</Text>
      </View>
      <FlatList
        data={data}
        keyExtractor={(item) => item.ID_PEDIDO.toString()}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <View style={styles.idColumn}>
              <Text style={styles.cell}>{item.ID_PEDIDO}</Text>
            </View>
            <View style={styles.clientColumn}>
              <Text style={styles.cell} numberOfLines={2} ellipsizeMode="tail">{item.NM_CLIENTE}</Text>
            </View>
            <View style={styles.dateColumn}>
              <Text style={styles.cell}>{new Date(item.DT_PEDIDO).toLocaleDateString()}</Text>
            </View>
            <View style={styles.operationsColumn}>
              <TouchableOpacity onPress={() => console.log('Foto clicada para', item.ID_PEDIDO)}>
                <MaterialIcons name="photo-camera" size={20} color="black" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => onRemoveItem(item.ID_PEDIDO)}>
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
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    padding: 10,
    alignItems: 'center',
  },
  cell: {
    color: '#333',
  },
  idColumn: {
    width: '20%',
    alignItems: 'center',
  },
  clientColumn: {
    width: '30%',
    alignItems: 'center',
  },
  dateColumn: {
    width: '25%',
    alignItems: 'center',
  },
  operationsColumn: {
    width: '25%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
});
