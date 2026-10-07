import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from '@expo-google-fonts/inter';
import { StoreProvider } from '../store';
import { Toast } from '../components/Toast';
import { initDatabase } from '../services/db';

export default function RootLayout() {
  const [loaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });
  // Open SQLite once at app start. Seeding is guarded (empty ledger only),
  // so this is safe to run on every launch, online or offline.
  useEffect(() => {
    try {
      initDatabase();
    } catch (e) {
      console.warn('SQLite init failed', e);
    }
  }, []);
  if (!loaded) return null;
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StoreProvider>
        <StatusBar style="auto" />
        <Toast />
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#F5F8FC' } }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="onboarding" />
          <Stack.Screen name="login" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="send" />
          <Stack.Screen name="confirm-transfer" />
          <Stack.Screen name="scan" />
          <Stack.Screen name="generate-qr" />
          <Stack.Screen name="account" />
          <Stack.Screen name="bill-pay" />
          <Stack.Screen name="bill-confirmation" />
          <Stack.Screen name="receipt" />
          <Stack.Screen name="transactions" />
          <Stack.Screen name="transaction-history" />
          <Stack.Screen name="lab/index" />
          <Stack.Screen name="lab/send" />
          <Stack.Screen name="lab/history" />
          <Stack.Screen name="transaction-detail" />
          <Stack.Screen name="link-transfer" />
          <Stack.Screen name="load" />
          <Stack.Screen name="notifications" />
          <Stack.Screen name="promos" />
          <Stack.Screen name="support" />
          <Stack.Screen name="board" />
          <Stack.Screen name="modals/delete-transaction" options={{ presentation: 'transparentModal', animation: 'fade' }} />
          <Stack.Screen name="modals/logout" options={{ presentation: 'transparentModal', animation: 'fade' }} />
        </Stack>
      </StoreProvider>
    </GestureHandlerRootView>
  );
}
