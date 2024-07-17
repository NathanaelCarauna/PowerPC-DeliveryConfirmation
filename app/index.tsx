import { CustomButton } from "@/components/CustomButtom";
import LogoBackground from "@/components/LogoBackground";
import { ThemedText } from "@/components/ThemedText";
import { ThemedInputText } from "@/components/ThemedTextInput";
import { ThemedView } from "@/components/ThemedView";
import { Entypo } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Button, GestureResponderEvent, Text, View } from "react-native";

export default function Index() {
  function handlePress(event: GestureResponderEvent): void {
    console.log("Login button pressed");
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
        }}>Login</ThemedText>

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
          <Entypo name="email" size={20} style={{ marginRight: 5 }} color="black" />
          <ThemedInputText style={{ flexGrow: 1 }} placeholder="Digite seu e-mail" />
        </ThemedView>
        <ThemedView style={{
          flexDirection: 'row',
          alignItems: 'baseline',
          width: '100%'
        }}>          
          <MaterialCommunityIcons name="onepassword" size={20} style={{ marginRight: 5 }} color="black" />
          <ThemedInputText style={{ flexGrow: 1 }} placeholder="Digite sua senha" secureTextEntry={true}/>
        </ThemedView>
        <CustomButton title="Acessar" onPress={handlePress} />
      </ThemedView>
    </ThemedView>
  );
}
