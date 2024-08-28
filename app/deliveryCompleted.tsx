import { CustomButton } from "@/components/CustomButtom";
import LogoBackground from "@/components/LogoBackground";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { GestureResponderEvent } from "react-native";
import * as ScreenOrientation from 'expo-screen-orientation';

export default function DeliveryCompleted() {
  const router = useRouter()

  useEffect(() => {
    const setPortraitOrientation = async () => {
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
    };
    setPortraitOrientation()
  }, [])

  function handlePress(event: GestureResponderEvent): void {
    router.push("/home");
  }

  return (
    <ThemedView
      style={{
        flex: 1,
        justifyContent: "space-between",
        alignItems: "center",
        padding: 20,
      }}
    >
      <LogoBackground labelText="PowerPC" />

      <ThemedView
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'transparent'
        }}>
        <MaterialIcons name="check-circle" size={100} color="#4CAF50" />
        <ThemedText 
          style={{
            fontSize: 24,
            fontWeight: 'bold',
            textAlign: 'center',
            marginTop: 20,
            marginBottom: 10,
          }}
        >
          Entrega Concluída com Sucesso!
        </ThemedText>
        <ThemedText
          style={{
            fontSize: 16,
            textAlign: 'center',
            marginBottom: 20,
          }}
        >
          Obrigado por usar nossos serviços.
        </ThemedText>
      </ThemedView>

      <CustomButton title="Voltar" onPress={handlePress} />
    </ThemedView>
  );
}
