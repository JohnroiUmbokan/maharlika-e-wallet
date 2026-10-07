import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useState } from 'react';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { IOSStatusBar } from '../components/IOSStatusBar';
import { Label, PrimaryButton, QuickChips, ScreenHeader } from '../components/ui';
import { colors, fonts } from '../theme';
import { formatPeso, useStore } from '../store';
import { toCentavos, validateTransfer } from '../utils/money';

export default function Send() {
  const params = useLocalSearchParams();
  const { balance } = useStore();
  const initialTo = typeof params.to === 'string' ? params.to : '';
  const initialAmount = parseFloat(typeof params.amount === 'string' ? params.amount : '0') || 0;
  const [to, setTo] = useState(initialTo);
  const [amount, setAmount] = useState(initialAmount);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  const pick = (chip) => { setAmount(parseFloat(chip.replace(/[^0-9.]/g, '')) || 0); setError(''); };

  const submit = () => {
    const result = validateTransfer({ recipient: to, amountCentavos: toCentavos(amount), balanceCentavos: toCentavos(balance) });
    if (!result.ok) return setError(result.error);
    setError('');
    router.push({ pathname: '/confirm-transfer', params: { to: to.trim(), amount: String(amount), msg: msg.trim() } });
  };

  return (
    <View style={styles.safe}>
      <SafeAreaView style={{ backgroundColor: '#006199' }} edges={[]}>
        <IOSStatusBar light />
        <ScreenHeader title="Send Money" right="help-circle" onRight={() => Alert.alert('Send Money', 'Free transfers between Maharlika wallets.')} />
      </SafeAreaView>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.sheet} showsVerticalScrollIndicator={false}>
        <Label>Send to</Label>
        <View style={styles.inputRow}>
          <TextInput value={to} onChangeText={setTo} placeholder="Name, mobile or account number" placeholderTextColor="#64748B" style={styles.input} />
          <Pressable onPress={() => router.push('/scan')} hitSlop={8}>
            <Feather name="maximize-2" size={20} color={colors.primary} />
          </Pressable>
        </View>
        <Label>Amount</Label>
        <View style={styles.amountBox}>
          <TextInput
            value={amount ? `₱${amount.toLocaleString('en-PH', { minimumFractionDigits: 2 })}` : '₱0.00'}
            onChangeText={(t) => setAmount(parseFloat(t.replace(/[^0-9.]/g, '')) || 0)}
            keyboardType="numeric"
            style={styles.amount}
          />
        </View>
        <QuickChips onPick={pick} />
        <Text style={styles.avail}>Available balance: {formatPeso(balance)}</Text>
        {!!error && <Text style={styles.error} accessibilityRole="alert">{error}</Text>}
        <Label>Message (Optional)</Label>
        <View style={styles.msgBox}>
          <TextInput value={msg} onChangeText={setMsg} placeholder="What's it for?" placeholderTextColor="#64748B" style={styles.input} multiline />
        </View>
        <View style={{ marginTop: 8 }}>
          <PrimaryButton label="Continue" onPress={submit} />
        </View>
        <View style={styles.secure}>
          <Feather name="shield" size={16} color={colors.primary} />
          <Text style={styles.secureText}>Secure transfers, made for every day.</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#006199' },
  scroll: { flex: 1, backgroundColor: '#F3F7FA', borderTopLeftRadius: 24, borderTopRightRadius: 24, marginTop: -20, overflow: 'hidden' },
  sheet: { padding: 16, gap: 16, paddingBottom: 24 },
  inputRow: { height: 56, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#E4EEF3', borderRadius: 16 },
  input: { flex: 1, fontFamily: fonts.regular, fontSize: 14, color: colors.ink },
  amountBox: { minHeight: 88, backgroundColor: '#E4EEF3', borderRadius: 16, justifyContent: 'center', paddingVertical: 16, paddingHorizontal: 16 },
  amount: { fontFamily: fonts.bold, fontSize: 36, color: colors.ink, textAlign: 'left' },
  avail: { fontFamily: fonts.regular, fontSize: 12, color: colors.muted },
  msgBox: { minHeight: 88, padding: 16, backgroundColor: '#E4EEF3', borderRadius: 16 },
  secure: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8, marginTop: 8 },
  error: { fontFamily: fonts.semiBold, fontSize: 13, color: '#EF4444' },
  secureText: { fontFamily: fonts.regular, fontSize: 12, color: colors.muted },
});
