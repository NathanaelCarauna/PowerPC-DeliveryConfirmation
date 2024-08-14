import { CustomButton } from "@/components/CustomButtom";
import LogoBackground from "@/components/LogoBackground";

import { ThemedText } from "@/components/ThemedText";
import { ThemedInputText } from "@/components/ThemedTextInput";
import { ThemedView } from "@/components/ThemedView";
import { Entypo, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from "expo-router";
import { GestureResponderEvent } from "react-native";

export default function DeliveryEvidencies() {
  const router = useRouter()
  function handlePress(event: GestureResponderEvent): void {
    console.log("Login button pressed");
    router.push('/documentPreview')
  }

  return (
    <ThemedView
      style={{
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "center",
        padding: 15,
      }}
    >
      <LogoBackground />
      <ThemedText
        type="subtitle" style={{
          marginTop: '70%',
          fontWeight: '900',
          fontSize: 20,
        }}>Comprovação de entrega</ThemedText>

      <ThemedView
        style={{
          flex: 1,
          width: '100%',
          justifyContent: 'center',
          alignItems: 'stretch',
          backgroundColor: 'transparent'

        }}>
      
        <CustomButton title="Assinar" onPress={handlePress} />
      </ThemedView>
    </ThemedView>
  );
}
