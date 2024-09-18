import { Pedido, PedidoEntregue } from '@/app/context/appContext';
import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

type ThemedTableProps = {
  data: PedidoEntregue[];  
};

export function ThemedTableDeliveries({ data }: ThemedTableProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.headerText, styles.idColumn]}>Pedido</Text>
        <Text style={[styles.headerText, styles.dateColumn]}>Data Pedido</Text>
        <Text style={[styles.headerText, styles.deliveryDateColumn]}>Data Entrega</Text>
        <Text style={[styles.headerText, styles.statusColumn]}>Status</Text>
      </View>
      <FlatList
        data={data}
        keyExtractor={(item) => item.ID_PEDIDO.toString()}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <View style={styles.idColumn}>
              <Text style={styles.cell}>{item.ID_PEDIDO}</Text>
            </View>
            <View style={styles.dateColumn}>
              <Text style={styles.cell}>{new Date(item.DT_PEDIDO).toLocaleDateString()}</Text>
            </View>
            <View style={styles.deliveryDateColumn}>
              <Text style={styles.cell}>{new Date().toLocaleDateString()}</Text>
            </View>
            <View style={styles.statusColumn}>
              <View style={[styles.statusBadge, item.STATUS === "Entregue" ? styles.statusDelivered : styles.statusPending]}>
                <Text style={styles.cell}>{item.STATUS}</Text>
              </View>
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
  dateColumn: {
    width: '25%',
    alignItems: 'center',
  },
  deliveryDateColumn: {
    width: '25%',
    alignItems: 'center',
  },
  statusColumn: {
    width: '25%',
    alignItems: 'center',
  },
  statusBadge: {
    padding: 5,
    borderRadius: 10,
    alignItems: 'center',
  },
  statusDelivered: {
    backgroundColor: 'lightgreen',
  },
  statusPending: {
    backgroundColor: '#FFD700',
  },
});
