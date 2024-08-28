import React, { useRef, useEffect, useState } from 'react';
import { StyleSheet, View, Alert, Dimensions, Text } from 'react-native';
import SignatureCanvas, { SignatureViewRef } from 'react-native-signature-canvas';
import { CustomButton } from "@/components/CustomButtom";
import { ThemedView } from "@/components/ThemedView";
import { useRouter } from "expo-router";
import * as ScreenOrientation from 'expo-screen-orientation';

export default function SignatureScreen() {
  const router = useRouter();
  const signatureRef = useRef<SignatureViewRef>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const setLandscapeOrientation = async () => {
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
    };

    setLandscapeOrientation();

    const updateCanvasSize = () => {
      const { width, height } = Dimensions.get('window');
      setCanvasSize({ width, height });
    };

    const subscription = Dimensions.addEventListener('change', updateCanvasSize);

    return () => {
      ScreenOrientation.unlockAsync();
      subscription.remove();
    };
  }, []);

  const handleSignature = (signature: string) => {
    if (signature) {
      console.log("Assinatura capturada:", signature);
      Alert.alert('Assinatura capturada', 'A assinatura foi capturada com sucesso!');
      // Aqui você pode enviar a assinatura para o servidor ou salvar localmente
    } else {
      Alert.alert('Erro', 'Por favor, forneça uma assinatura.');
    }
  };

  const handleClear = () => {
    signatureRef.current?.clearSignature();
  };

  const handleConfirm = () => {
    signatureRef.current?.readSignature();
  };

  return (
    <ThemedView style={styles.container}>
      <Text style={styles.instructionText}>Por favor, assine abaixo</Text>
      <View style={styles.signatureContainer}>
        <SignatureCanvas
          ref={signatureRef}
          onOK={handleSignature}
          onEmpty={() => Alert.alert('Erro', 'Por favor, forneça uma assinatura.')}
          descriptionText=""
          clearText="Limpar"
          confirmText="Salvar"
          webStyle={`
            .m-signature-pad {
              box-shadow: none;
              border: none;
              width: 100%;
              height: 100%;
            }
            .m-signature-pad--footer {
              display: none;
              margin: 0;
            }
            .m-signature-pad--body {
              position: absolute;
              left: 0;
              top: 0;
              right: 0;
              bottom: 0;
            }
            .m-signature-pad--body canvas {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              height: 100%;
            }
          `}
        />
        <View style={styles.signatureLine} />
      </View>
      <View style={styles.buttonsContainer}>
        <CustomButton title="Limpar" onPress={handleClear} style={styles.button} />
        <CustomButton title="Confirmar" onPress={handleConfirm} style={styles.button} />
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  signatureContainer: {
    flex: 1,
    position: 'relative',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  button: {
    minWidth: 120,
    maxWidth: 120,
    marginHorizontal: 10,
  },
  instructionText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  signatureLine: {
    position: 'absolute',
    bottom: '25%', // Ajuste este valor para mover a linha para cima
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: '#007bff',
  },
});
