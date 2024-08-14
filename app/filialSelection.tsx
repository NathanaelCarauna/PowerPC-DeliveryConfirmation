import { CustomButton } from "@/components/CustomButtom";
import LogoBackground from "@/components/LogoBackground";
import { ThemedSelectDropdown } from "@/components/ThemedSelectDropdown";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Entypo } from '@expo/vector-icons';
import { useRouter } from "expo-router";
import { useState } from "react";
import { GestureResponderEvent } from "react-native";

export default function FilialSelection() {
  const router = useRouter()
  const [selectedFilial, setSelectedFilial] = useState<string>('1');
  function handlePress(event: GestureResponderEvent): void {
    console.log("Enter button pressed, Selected filial: " + selectedFilial);
    router.push('/home')
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
        }}>Qual a sua filial?</ThemedText>

      <ThemedView
        style={{
          flex: 1,
          width: '100%',
          justifyContent: 'center',
          alignItems: 'stretch',
          backgroundColor: 'transparent'

        }}>
        <ThemedView style={{
          flexDirection: 'row',
          alignItems: 'baseline',
          width: '100%'
        }}>
          <Entypo name="home" size={20} style={{ marginRight: 5 }} color="black" />
          <ThemedSelectDropdown
            selectedValue={selectedFilial}
            onValueChange={(itemValue) => setSelectedFilial(itemValue)}
          />
        </ThemedView>
        <ThemedView style={{
          flexDirection: 'row',
          alignItems: 'baseline',
          width: '100%'
        }}>
        </ThemedView>
        <CustomButton title="Entrar" onPress={handlePress} />
      </ThemedView>
    </ThemedView>
  );
}
