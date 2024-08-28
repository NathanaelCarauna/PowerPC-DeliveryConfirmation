import React, { useState, useEffect } from 'react';
import { GestureResponderEvent, StyleSheet, View, TextInput, Keyboard, Button } from 'react-native';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { Camera, CameraType, CameraView } from 'expo-camera';
import { CustomButton } from "@/components/CustomButtom";
import LogoBackground from "@/components/LogoBackground";
import { ThemedTable } from "@/components/ThemedTable";
import { ThemedText } from "@/components/ThemedText";
import { ThemedInputText } from "@/components/ThemedTextInput";
import { ThemedView } from "@/components/ThemedView";
import { useRouter } from "expo-router";

const sampleData = [
  { id: '1', pedido: 'Pedido 001', data: '01/08/2024' },
  { id: '2', pedido: 'Pedido 002', data: '02/08/2024' },
  { id: '3', pedido: 'Pedido 003', data: '03/08/2024' },
];

export default function Home() {
  const router = useRouter();  
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanning, setScanning] = useState(false);  
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleSearch = (searchQuery : string) => {
    const result = sampleData.filter(item => item.id === searchQuery);
    const newItems = result.filter(item => !filteredData.some(data => data.id === item.id));
    setFilteredData([...filteredData, ...newItems]);
    setSearchQuery('')
    Keyboard.dismiss();
  };

  const handleRemoveItem = (id: string) => {
    setFilteredData(filteredData.filter(item => item.id !== id));
  };

  const handleDelivery = (event: GestureResponderEvent): void => {
    console.log("Login button pressed");
    router.push('/deliveryEvidencies');
  };

  const handleBarcodeScan = () => {
    if (hasPermission) {
      setScanning(true);
    } else {
      alert('Camera permission is required to scan barcodes');
    }
  };

  const handleBarCodeScanned = ({ type, data }: { type: string, data: string }) => {
    console.log("Bar code detected: " + data)
    setScanning(false);    
    handleSearch(data);
  };

  if (scanning) {
    return (
      <View style={styles.cameraContainer}>
        <CameraView
          style={styles.camera}
          barcodeScannerSettings={{
            barcodeTypes: ["qr", 'code128', 'code39','code93'],
          }}
          onBarcodeScanned={handleBarCodeScanned}
          
        >
          <View style={styles.cameraOverlay}>
            <Button title="Cancelar" onPress={() => setScanning(false)}  />
          </View>
        </CameraView>
      </View>
    );
  }

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
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Buscar pedido"
          onSubmitEditing={e => handleSearch(e.nativeEvent.text)}
        />
        <MaterialIcons
          name="search"
          size={20}
          color="black"
          onPress={e => handleSearch(searchQuery)}
          style={styles.searchIcon}
        />
      </ThemedView>

      <ThemedView style={styles.content}>
        <ThemedTable data={filteredData} onRemoveItem={handleRemoveItem} />
        <CustomButton title="Entregar" onPress={handleDelivery} />
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
  cameraContainer: {
    flex: 1,
    width: '100%',
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'transparent',
    paddingBottom: 20,
  },
  searchContainer: {
    marginTop: '40%',
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
