import React, { useRef } from 'react';
import { StyleSheet, View, Alert } from 'react-native';
// import SignatureCanvas from 'react-native-signature-canvas';
import { CustomButton } from "@/components/CustomButtom";
import { ThemedView } from "@/components/ThemedView";
import { useRouter } from "expo-router";

export default function SignatureScreen() {
  const router = useRouter();
  // const signatureRef = useRef<SignatureCanvas>(null);

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
    // signatureRef.current?.clearSignature();
  };

  const handleConfirm = () => {
    // signatureRef.current?.readSignature();
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.signatureContainer}>
        {/* <SignatureCanvas
          // ref={signatureRef}
          onOK={handleSignature}
          onEmpty={() => Alert.alert('Erro', 'Por favor, forneça uma assinatura.')}
          descriptionText="Assine aqui"
          clearText="Limpar"
          confirmText="Salvar"
          webStyle={`
            .m-signature-pad {
              box-shadow: none;
              border: none;
            }
            .m-signature-pad--footer {
              display: none;
              margin: 0;
            }
          `}
        /> */}
      </View>

      <View style={styles.buttonsContainer}>
        <CustomButton title="Limpar" onPress={handleClear}  />
        <CustomButton title="Enviar" onPress={handleConfirm} />
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
  },
  signatureContainer: {
    width: '100%',
    height: 200,
    borderColor: '#007bff',
    borderWidth: 2,
    borderRadius: 10,
    marginBottom: 20,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  clearButton: {
    flex: 1,
    backgroundColor: '#dc3545', // Vermelho para o botão de limpar
    marginRight: 10,
  },
  submitButton: {
    flex: 1,
    backgroundColor: '#007bff', // Azul para o botão de enviar
  },
});
