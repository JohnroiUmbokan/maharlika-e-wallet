import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useState } from 'react';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { IOSStatusBar } from '../components/IOSStatusBar';
import { BillerAvatar, BottomNav, Label, ModalSheet, PrimaryButton, ScreenHeader } from '../components/ui';
import { colors, fonts } from '../theme';
import { formatPeso, useStore } from '../store';
import { toCentavos, validateBillPayment } from '../utils/money';

export default function BillPay() {
  const params = useLocalSearchParams();
  const { billers, balance } = useStore();
  const initial = billers.find((b) => b.id === params.id) ?? billers[0];
  const [billerId, setBillerId] = useState(initial.id);
  const [accountNo, setAccountNo] = useState('1234567890');
  const [picking, setPicking] = useState(false);
  const biller = billers.find((b) => b.id === billerId) ?? initial;
  const [amount, setAmount] = useState(biller.amount);

  const choose = (id) => {
    const next = billers.find((b) => b.id === id);
    setBillerId(id);
    setAmount(next.amount);
    setPicking(false);
  };

  const confirm = () => {
    const result = validateBillPayment({ billerId, accountNo: accountNo.trim(), amountCentavos: toCentavos(amount), balanceCentavos: toCentavos(balance) });
    if (!result.ok) return Alert.alert('Check details', result.error);
    router.push({ pathname: '/bill-confirmation', params: { billerId, accountNo: accountNo.trim(), amount: String(amount) } });
  };

  return (
    <View style={styles.safe}>
      <SafeAreaView style={{ backgroundColor: '#006199' }} edges={[]}>
        <IOSStatusBar light />
        <ScreenHeader title="Bill Payment" right="help-circle" onRight={() => Alert.alert('Bill Payment', 'Pay electricity, cards and more.')} />
      </SafeAreaView>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.sheet} showsVerticalScrollIndicator={false}>
        <Label>Biller</Label>
        <Pressable style={styles.selectRow} onPress={() => setPicking(true)} accessibilityRole="button">
          <BillerAvatar initial={biller.initial} color={biller.color} size={40} />
          <Text style={styles.selectName}>{biller.name}</Text>
          <Feather name="chevron-down" size={22} color={colors.primary} />
        </Pressable>
        <Label>Account Number</Label>
        <View style={styles.inputRow}>
          <TextInput value={accountNo} onChangeText={(t) => setAccountNo(t.replace(/[^0-9]/g, ''))} style={styles.input} keyboardType="numeric" placeholder="e.g. 1234567890" placeholderTextColor="#64748B" />
        </View>
        <Label>Amount</Label>
        <View style={styles.amountBox}>
          <Text style={styles.amountPeso}>₱</Text>
          <TextInput
            value={amount ? amount.toLocaleString('en-PH', { minimumFractionDigits: 2 }) : ''}
            onChangeText={(t) => setAmount(parseFloat(t.replace(/[^0-9.]/g, '')) || 0)}
            keyboardType="numeric"
            placeholder="0.00"
            placeholderTextColor="#94A3B8"
            style={styles.amount}
          />
        </View>
        <View style={styles.payFrom}>
          <View>
            <Text style={styles.payLabel}>Pay from</Text>
            <Text style={styles.payLabel}>Available balance</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={styles.wallet}>Maharlika Wallet</Text>
            <Text style={styles.bal}>{formatPeso(balance)}</Text>
          </View>
        </View>
        <View style={{ marginTop: 8 }}>
          <PrimaryButton label="Pay" onPress={confirm} />
        </View>
        <View style={styles.note}>
          <Feather name="shield" size={16} color={colors.primary} />
          <Text style={styles.noteText}>Review your details before paying.</Text>
        </View>
      </ScrollView>
      <BottomNav active="bills" />

      <ModalSheet visible={picking} onClose={() => setPicking(false)} title="Choose Biller">
        {billers.map((b) => (
          <Pressable key={b.id} style={styles.pickRow} onPress={() => choose(b.id)}>
            <BillerAvatar initial={b.initial} color={b.color} size={40} />
            <View style={{ flex: 1 }}>
              <Text style={styles.selectName}>{b.name}</Text>
              <Text style={styles.payLabel}>{b.meta}</Text>
            </View>
            {b.id === billerId && <Feather name="check" size={20} color={colors.primary} />}
          </Pressable>
        ))}
      </ModalSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#006199' },
  scroll: { flex: 1, backgroundColor: '#F3F7FA', borderTopLeftRadius: 24, borderTopRightRadius: 24, marginTop: -20, overflow: 'hidden' },
  sheet: { padding: 16, gap: 16, paddingBottom: 24 },
  selectRow: { height: 64, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 16, backgroundColor: '#E4EEF3', borderRadius: 16 },
  selectName: { flex: 1, fontFamily: fonts.semiBold, fontSize: 16, color: colors.ink },
  inputRow: { height: 56, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#E4EEF3', borderRadius: 16 },
  input: { flex: 1, fontFamily: fonts.regular, fontSize: 15, color: colors.ink },
  peso: { fontFamily: fonts.medium, fontSize: 16, color: colors.muted },
  amountBox: { minHeight: 88, borderRadius: 16, backgroundColor: '#E4EEF3', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, gap: 8 },
  amountPeso: { fontFamily: fonts.bold, fontSize: 32, color: colors.ink },
  amount: { flex: 1, fontFamily: fonts.bold, fontSize: 32, color: colors.ink, paddingVertical: 0 },
  payFrom: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#E4F1F8', borderRadius: 16, padding: 16 },
  payLabel: { fontFamily: fonts.regular, fontSize: 12, color: colors.muted },
  wallet: { fontFamily: fonts.bold, fontSize: 13, color: colors.primary },
  bal: { fontFamily: fonts.bold, fontSize: 14, color: colors.ink, marginTop: 2 },
  note: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8, marginTop: 8 },
  noteText: { fontFamily: fonts.regular, fontSize: 12, color: colors.muted },
  pickRow: { flexDirection: 'row', alignItems: 'center', gap: 16, paddingVertical: 8 },
});
