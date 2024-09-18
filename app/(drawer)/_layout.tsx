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

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer'; // Importar DrawerItem e DrawerContentScrollView
import { Linking } from 'react-native'; // Importar Linking para abrir URLs

function CustomDrawerContent(props : any) {
  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <DrawerItem
        label="Sair"
        onPress={() => {
          // Lógica para logout
          console.log('Logout realizado'); // Substitua isso pela sua lógica de logout
        }}
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
    <AppProvider>
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
    </AppProvider>
  );
}
