import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Drawer } from 'expo-router/drawer'; // Importar o Drawer do expo-router/drawer
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler'; // Importar GestureHandlerRootView

import { useColorScheme } from '@/hooks/useColorScheme';
import { useAppContext } from '../context/appContext'; // Importe o hook useAppContext
import { useRouter, useNavigation } from 'expo-router'; // Importe o hook useRouter e useNavigation
import { TouchableOpacity, Image } from 'react-native';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// Botão do menu Drawer
function DrawerButton() {
  const navigation = useNavigation();
  return (
    <TouchableOpacity onPress={() => navigation.openDrawer()} style={{ marginLeft: 15 }}>
      <Image source={require('../../assets/images/menu-icon.png')} style={{ width: 24, height: 24 }} />
    </TouchableOpacity>
  );
}

// Custom Drawer Content
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';

function CustomDrawerContent(props: any) {
  const { logout } = useAppContext();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.replace('/'); // Redireciona para a tela de login
  };

  const handleFilialSelection = () => {
    router.replace('/filialSelection');
  };

  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <DrawerItem label="Trocar Filial" onPress={handleFilialSelection} />
      <DrawerItem label="Sair" onPress={handleLogout} />
    </DrawerContentScrollView>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Drawer drawerContent={(props) => <CustomDrawerContent {...props} />}>
          {/* Tela Home com botão de menu */}
          <Drawer.Screen 
            name="home" 
            options={{ 
              headerShown: true, 
              headerLeft: () => <DrawerButton />, 
              drawerLabel: 'Realizar entrega', 
              title: '',
              headerStyle:{
                backgroundColor: 'transparent',
                elevation: 0,
                shadowOpacity: 0
              } 
            }} 
          />

          {/* Tela Deliveries agora também tem o botão do Drawer */}
          <Drawer.Screen 
            name="deliveries" 
            options={{ 
              headerShown: true, 
              headerLeft: () => <DrawerButton />, 
              drawerLabel: 'Minhas entregas', 
              title: '',
              headerStyle:{
                backgroundColor: 'transparent',
                elevation: 0,
                shadowOpacity: 0
              } 
            }} 
          />
        </Drawer>
      </GestureHandlerRootView>
    </ThemeProvider>
  );
}
