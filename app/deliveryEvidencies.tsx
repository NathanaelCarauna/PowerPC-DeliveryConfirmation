import { useState } from 'react';
import { TouchableOpacity, Image, Alert, ScrollView, StyleSheet, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { CustomButton } from "@/components/CustomButtom";
import LogoBackground from "@/components/LogoBackground";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useRouter } from "expo-router";
import { GestureResponderEvent } from "react-native";

export default function DeliveryEvidencies() {
  const router = useRouter();

  const [docPhoto, setDocPhoto] = useState<string | null>(null);
  const [canhotoPhoto, setCanhotoPhoto] = useState<string | null>(null);
  const [productPhoto, setProductPhoto] = useState<string | null>(null);

  async function openCamera(setPhoto: React.Dispatch<React.SetStateAction<string | null>>) {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setPhoto(result.assets[0].uri);
    } else {
      Alert.alert('Aviso', 'A captura de imagem foi cancelada.');
    }
  }

  function handleSignPress() {
    if (docPhoto && canhotoPhoto && productPhoto) {
      console.log("Assinatura permitida");
      router.push('/documentPreview');
    } else {
      Alert.alert('Aviso', 'Todas as fotos são obrigatórias.');
    }
  }

  return (
    <ThemedView style={styles.container}>
      <LogoBackground />
      <ThemedText style={styles.title}>Comprovação de entrega</ThemedText>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <TouchableOpacity onPress={() => openCamera(setDocPhoto)} style={styles.photoButton}>
          {docPhoto ? (
            <View style={styles.imageContainer}>
              <Image source={{ uri: docPhoto }} style={styles.imagePreview} />
              <ThemedText style={styles.imageLabel}>Foto do Documento</ThemedText>
            </View>
          ) : (
            <ThemedText style={styles.buttonText}>Foto do Documento</ThemedText>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => openCamera(setCanhotoPhoto)} style={styles.photoButton}>
          {canhotoPhoto ? (
            <View style={styles.imageContainer}>
              <Image source={{ uri: canhotoPhoto }} style={styles.imagePreview} />
              <ThemedText style={styles.imageLabel}>Foto do Canhoto</ThemedText>
            </View>
          ) : (
            <ThemedText style={styles.buttonText}>Foto do Canhoto</ThemedText>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => openCamera(setProductPhoto)} style={styles.photoButton}>
          {productPhoto ? (
            <View style={styles.imageContainer}>
              <Image source={{ uri: productPhoto }} style={styles.imagePreview} />
              <ThemedText style={styles.imageLabel}>Foto do Produto</ThemedText>
            </View>
          ) : (
            <ThemedText style={styles.buttonText}>Foto do Produto</ThemedText>
          )}
        </TouchableOpacity>
      </ScrollView>

      <CustomButton title="Assinar" onPress={handleSignPress} />
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
  title: {
    marginTop: '65%',
    marginBottom: 20,
    fontWeight: '900',
    fontSize: 20,
  },
  scrollContainer: {
    flexGrow: 1,
    width: 200,
    justifyContent: 'center',
    alignItems: 'stretch',
    paddingBottom: 20,
  },
  photoButton: {
    backgroundColor: '#0f3a6d',
    padding: 15,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  imageContainer: {
    position: 'relative',
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  imageLabel: {
    position: 'absolute',
    bottom: 5,
    backgroundColor: 'rgba(0, 123, 255, 0.8)',
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    paddingHorizontal: 5,
    borderRadius: 5,
  },  
});
