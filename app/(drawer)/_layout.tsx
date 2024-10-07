import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { Drawer } from 'expo-router/drawer'; // Importar o Drawer do expo-router/drawer
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler'; // Importar GestureHandlerRootView

import { useColorScheme } from '@/hooks/useColorScheme';
import { AppProvider } from '../context/appContext';
import { useAppContext } from '../context/appContext'; // Importe o hook useAppContext
import { useRouter } from 'expo-router'; // Importe o hook useRouter

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer'; // Importar DrawerItem e DrawerContentScrollView
import { Linking } from 'react-native'; // Importar Linking para abrir URLs

function CustomDrawerContent(props: any) {
  const { logout } = useAppContext(); // Use o hook useAppContext para obter a função de logout
  const router = useRouter(); // Use o hook useRouter para navegação

  const handleLogout = async () => {
    await logout(); // Chame a função de logout
    router.replace('/'); // Redirecione para a tela de login (index)
  };

  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <DrawerItem
        label="Sair"
        onPress={handleLogout} // Use a nova função handleLogout
      />
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
        <Drawer
          drawerContent={(props) => <CustomDrawerContent {...props} />}
        >
          <Drawer.Screen name="home" options={{ headerShown: false, drawerLabel: 'Realizar entrega', title: 'overview' }} />
          <Drawer.Screen name="deliveries" options={{ headerShown: false, drawerLabel: 'Minhas entregas', title: 'overview' }} />
          {/* <Drawer.Screen name="changeFilial" options={{ headerShown: false, drawerLabel: 'Trocar filial', title: 'overview' }} />             */}
        </Drawer>
      </GestureHandlerRootView>
    </ThemeProvider>
  );
}
