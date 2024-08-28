import { CustomButton } from "@/components/CustomButtom";
import LogoBackground from "@/components/LogoBackground";

import { ThemedText } from "@/components/ThemedText";
import { ThemedInputText } from "@/components/ThemedTextInput";
import { ThemedView } from "@/components/ThemedView";
import { Entypo } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useRouter } from "expo-router";
import { Button, GestureResponderEvent, Text, View } from "react-native";
import { NativeStackScreenProps } from "react-native-screens/lib/typescript/native-stack/types";

export default function Index() {
  const router = useRouter()
  function handlePress(event: GestureResponderEvent): void {
    console.log("Login button pressed");
    router.push('/filialSelection')
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
      <LogoBackground labelText="PowerPC - Login"/>

      <ThemedView
        style={{
          flex: 1,
          marginTop: 50,
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
