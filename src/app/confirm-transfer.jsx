import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import * as LocalAuthentication from 'expo-local-authentication';
import * as Haptics from 'expo-haptics';
import { IOSStatusBar } from '../components/IOSStatusBar';
import { MLogo } from '../components/MLogo';
import { ScreenHeader, ZigZag } from '../components/ui';
import { colors, fonts } from '../theme';
import { formatPeso, useStore } from '../store';
import { TRANSFER_FEE_CENTAVOS } from '../utils/money';

export default function ConfirmTransfer() {
  const params = useLocalSearchParams();
  const { sendMoney } = useStore();
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  const to = typeof params.to === 'string' ? params.to : '';
  const amount = parseFloat(typeof params.amount === 'string' ? params.amount : '0') || 0;
  const msg = typeof params.msg === 'string' ? params.msg : '';
  const fee = TRANSFER_FEE_CENTAVOS / 100;

  const authorize = async () => {
    try {
      const hasHw = await LocalAuthentication.hasHardwareAsync();
      if (!hasHw) return true; // dev-build fallback: PIN screen would go here
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      if (!enrolled) return true;
      const res = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Confirm transfer',
        fallbackLabel: 'Use PIN',
        cancelLabel: 'Cancel',
      });
      return res.success;
    } catch {
      return true;
    }
  };

  const confirm = async () => {
    if (busy) return;
    setBusy(true);
    const ok = await authorize();
    if (!ok) {
      setBusy(false);
      return;
    }
    // Deduct amount + ₱3.00 fee via the store (mock backend, ~400ms).
    await new Promise((r) => setTimeout(r, 400));
    const total = amount + fee;
    if (sendMoney(to, total, msg)) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      setDone(true);
    } else {
      Alert.alert('Transfer failed', 'Insufficient balance or a network blip. Try again.');
    }
    setBusy(false);
  };

  return (
    <View style={styles.safe}>
      <SafeAreaView style={{ backgroundColor: '#006199' }} edges={[]}>
        <IOSStatusBar light />
        <ScreenHeader title="Confirm Transfer" />
      </SafeAreaView>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.sheet} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <ZigZag />
          <MLogo />
          <Text style={styles.status}>{done ? 'Successful' : 'Review & confirm'}</Text>
          <View style={styles.rows}>
            <Row k="Recipient" v={to || '—'} />
            <Row k="Amount" v={formatPeso(amount)} strong />
            <Row k="Fee" v={formatPeso(fee)} />
            <Row k="Total" v={formatPeso(amount + fee)} strong />
            {!!msg && <Row k="Message" v={msg} />}
          </View>
        </View>
        {!done ? (
          <Pressable style={styles.confirm} onPress={confirm} accessibilityRole="button" accessibilityLabel="Confirm transfer">
            <Feather name="lock" size={18} color="#FFFFFF" />
            <Text style={styles.confirmText}>{busy ? 'Confirming…' : 'Confirm'}</Text>
          </Pressable>
        ) : (
          <Pressable
            style={styles.confirm}
            onPress={() => router.push({ pathname: '/receipt', params: { name: to, amount: String(amount + fee), ref: `MK-${Date.now().toString().slice(-8)}`, account: '•••• 6789' } })}
            accessibilityRole="button"
          >
            <Text style={styles.confirmText}>View Receipt</Text>
          </Pressable>
        )}
        <Text style={styles.note}>Centavos math · fee {formatPeso(fee)} · biometric or PIN required</Text>
      </ScrollView>
    </View>
  );
}

function Row({ k, v, strong = false }) {
  return (
    <View style={styles.row}>
      <Text style={styles.k}>{k}</Text>
      <Text style={[styles.v, strong && styles.strong]}>{v}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#006199' },
  scroll: { flex: 1, backgroundColor: '#F3F7FA', borderTopLeftRadius: 24, borderTopRightRadius: 24, marginTop: -20, overflow: 'hidden' },
  sheet: { padding: 16, gap: 16, paddingBottom: 24 },
  card: { backgroundColor: colors.white, borderRadius: 20, padding: 24, paddingTop: 16, alignItems: 'center', borderWidth: 1, borderColor: '#E4EEF3' },
  status: { fontFamily: fonts.bold, fontSize: 20, color: '#16A34A', marginTop: 12 },
  rows: { alignSelf: 'stretch', marginTop: 16, gap: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  k: { fontFamily: fonts.regular, fontSize: 12, color: colors.muted },
  v: { fontFamily: fonts.medium, fontSize: 13, color: colors.ink },
  strong: { fontFamily: fonts.bold, fontSize: 16 },
  confirm: { minHeight: 56, borderRadius: 16, backgroundColor: '#0B1B26', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  confirmText: { fontFamily: fonts.semiBold, fontSize: 16, color: '#FFFFFF' },
  note: { fontFamily: fonts.regular, fontSize: 12, color: colors.muted, textAlign: 'center' },
});
