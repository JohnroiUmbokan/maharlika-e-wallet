import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import * as LocalAuthentication from 'expo-local-authentication';
import * as Haptics from 'expo-haptics';
import { IOSStatusBar } from '../components/IOSStatusBar';
import { BottomNav, ScreenHeader } from '../components/ui';
import { colors, fonts } from '../theme';
import { formatPeso, useStore } from '../store';

export default function BillConfirmation() {
  const params = useLocalSearchParams();
  const { payBiller, billers } = useStore();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const billerId = typeof params.billerId === 'string' ? params.billerId : '';
  const accountNo = typeof params.accountNo === 'string' ? params.accountNo : '';
  const amount = parseFloat(typeof params.amount === 'string' ? params.amount : '0') || 0;
  const biller = billers.find((b) => b.id === billerId);
  const name = biller?.name ?? 'Biller';

  const pay = async () => {
    if (busy) return;
    setBusy(true);
    setError('');
    try {
      const hasHw = await LocalAuthentication.hasHardwareAsync().catch(() => false);
      const enrolled = hasHw ? await LocalAuthentication.isEnrolledAsync().catch(() => false) : false;
      if (enrolled) {
        const res = await LocalAuthentication.authenticateAsync({
          promptMessage: 'Confirm bill payment',
          fallbackLabel: 'Use PIN',
          cancelLabel: 'Cancel',
        });
        if (!res.success) {
          setBusy(false);
          return;
        }
      }
      await new Promise((r) => setTimeout(r, 400)); // mock latency
      if (payBiller({ ...(biller ?? { id: billerId, name }), amount }, accountNo)) {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
        router.push({ pathname: '/receipt', params: { name, amount: String(amount), ref: `MK-${Date.now().toString().slice(-8)}`, account: accountNo, initial: biller?.initial ?? 'M', color: biller?.color ?? '#E07B39' } });
      } else {
        setError('Payment failed. Check your balance and try again.');
      }
    } catch {
      setError('Payment failed. Check your balance and try again.');
    }
    setBusy(false);
  };

  return (
    <View style={styles.safe}>
      <SafeAreaView style={{ backgroundColor: '#006199' }} edges={[]}>
        <IOSStatusBar light />
        <ScreenHeader title="Bill Payment Confirmation" />
      </SafeAreaView>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.sheet} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Row k="Biller" v={name} />
          <Row k="Account No." v={accountNo || '—'} />
          <Row k="Amount" v={formatPeso(amount)} strong />
        </View>
        {!!error && <Text style={styles.error} accessibilityRole="alert">{error}</Text>}
        <Pressable style={styles.pay} onPress={pay} accessibilityRole="button" accessibilityLabel="Pay now">
          <Text style={styles.payText}>{busy ? 'Processing…' : 'Pay Now'}</Text>
        </Pressable>
        <Pressable onPress={() => router.back()} accessibilityRole="button" accessibilityLabel="Cancel payment">
          <Text style={styles.cancel}>Cancel</Text>
        </Pressable>
      </ScrollView>
      <BottomNav active="bills" />
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
  card: { backgroundColor: colors.white, borderRadius: 20, padding: 24, gap: 16, borderWidth: 1, borderColor: '#E4EEF3' },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  k: { fontFamily: fonts.regular, fontSize: 12, color: colors.muted },
  v: { fontFamily: fonts.medium, fontSize: 13, color: colors.ink },
  strong: { fontFamily: fonts.bold, fontSize: 20 },
  error: { fontFamily: fonts.semiBold, fontSize: 13, color: '#EF4444', textAlign: 'center' },
  pay: { minHeight: 56, borderRadius: 28, backgroundColor: '#006199', alignItems: 'center', justifyContent: 'center' },
  payText: { fontFamily: fonts.semiBold, fontSize: 16, color: '#FFFFFF' },
  cancel: { fontFamily: fonts.semiBold, fontSize: 15, color: colors.ink, textAlign: 'center', paddingVertical: 8 },
});
