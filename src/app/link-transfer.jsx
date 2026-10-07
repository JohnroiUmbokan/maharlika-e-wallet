import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { IOSStatusBar } from '../components/IOSStatusBar';
import { BillerAvatar, BottomNav, Label, ScreenHeader } from '../components/ui';
import { colors, fonts } from '../theme';
import { formatPeso, useStore } from '../store';

export default function LinkTransfer() {
  const params = useLocalSearchParams();
  const { balance, linked, sendMoney, adjustBalance, adjustLinkedBalance, addTransaction } = useStore();
  const id = typeof params.id === 'string' ? params.id : '';
  const account = linked.find((l) => l.id === id);
  const [direction, setDirection] = useState('in'); // 'in': bank -> wallet, 'out': wallet -> bank
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');

  if (!account) {
    return (
      <View style={styles.safe}>
        <SafeAreaView style={{ backgroundColor: '#006199' }} edges={[]}>
          <IOSStatusBar light />
          <ScreenHeader title="Bank Transfer" />
        </SafeAreaView>
        <View style={styles.missing}>
          <Text style={styles.missingText}>This linked account is no longer available.</Text>
          <Pressable style={styles.cta} onPress={() => router.back()} accessibilityRole="button">
            <Text style={styles.ctaText}>Go Back</Text>
          </Pressable>
        </View>
        <BottomNav active="wallet" />
      </View>
    );
  }

  const submit = () => {
    const amt = parseFloat(amount) || 0;
    if (amt <= 0) return setError('Enter an amount greater than ₱0.');
    if (direction === 'in') {
      if (amt > (account.balance ?? 0)) return setError(`Only ${formatPeso(account.balance ?? 0)} available in ${account.name}.`);
      adjustLinkedBalance(account.id, -amt);
      adjustBalance(amt);
      addTransaction({ title: `Cash In via ${account.name}`, sub: 'Just now', amount: amt, kind: 'received', icon: 'arrow-down-left' });
    } else {
      if (amt > balance) return setError('Insufficient Maharlika balance.');
      if (!sendMoney(account.name, amt, `Transfer to ${account.detail}`)) return setError('Transfer failed. Try again.');
      adjustLinkedBalance(account.id, amt);
    }
    setError('');
    setAmount('');
    Alert.alert('Transfer complete', direction === 'in' ? `${formatPeso(amt)} moved to your Maharlika Wallet.` : `${formatPeso(amt)} sent to ${account.name}.`, [
      { text: 'OK', onPress: () => router.back() },
    ]);
  };

  return (
    <View style={styles.safe}>
      <SafeAreaView style={{ backgroundColor: '#006199' }} edges={[]}>
        <IOSStatusBar light />
        <ScreenHeader title="Bank Transfer" />
      </SafeAreaView>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.sheet} showsVerticalScrollIndicator={false}>
        <View style={styles.acctCard}>
          <BillerAvatar initial={account.initial} color={account.color} size={48} />
          <View style={{ flex: 1 }}>
            <Text style={styles.acctName}>{account.name}</Text>
            <Text style={styles.acctSub}>{account.detail}</Text>
          </View>
          <Text style={styles.acctBal}>{formatPeso(account.balance ?? 0)}</Text>
        </View>
        <View style={styles.balanceRow}>
          <Text style={styles.balanceLabel}>Maharlika Wallet</Text>
          <Text style={styles.balanceAmt}>{formatPeso(balance)}</Text>
        </View>
        <Label>Direction</Label>
        <View style={styles.dirRow}>
          <Pressable style={[styles.dir, direction === 'in' && styles.dirActive]} onPress={() => { setDirection('in'); setError(''); }} accessibilityRole="button" accessibilityLabel="Bank to wallet">
            <Text style={[styles.dirText, direction === 'in' && styles.dirTextActive]}>Bank → Wallet</Text>
          </Pressable>
          <Pressable style={[styles.dir, direction === 'out' && styles.dirActive]} onPress={() => { setDirection('out'); setError(''); }} accessibilityRole="button" accessibilityLabel="Wallet to bank">
            <Text style={[styles.dirText, direction === 'out' && styles.dirTextActive]}>Wallet → Bank</Text>
          </Pressable>
        </View>
        <Label>Amount</Label>
        <View style={styles.inputRow}>
          <Text style={styles.peso}>₱</Text>
          <TextInput value={amount} onChangeText={(t) => { setAmount(t.replace(/[^0-9.]/g, '')); setError(''); }} placeholder="0.00" placeholderTextColor="#64748B" style={styles.input} keyboardType="numeric" />
        </View>
        {!!error && <Text style={styles.error} accessibilityRole="alert">{error}</Text>}
        <Pressable style={styles.cta} onPress={submit} accessibilityRole="button" accessibilityLabel="Transfer">
          <Text style={styles.ctaText}>Transfer</Text>
        </Pressable>
      </ScrollView>
      <BottomNav active="wallet" />
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#006199' },
  scroll: { flex: 1, backgroundColor: '#F3F7FA', borderTopLeftRadius: 24, borderTopRightRadius: 24, marginTop: -20, overflow: 'hidden' },
  sheet: { padding: 16, gap: 12, paddingBottom: 24 },
  missing: { flex: 1, backgroundColor: '#F3F7FA', borderTopLeftRadius: 24, borderTopRightRadius: 24, marginTop: -20, padding: 24, gap: 16, alignItems: 'center', justifyContent: 'center' },
  missingText: { fontFamily: fonts.regular, fontSize: 14, color: colors.muted, textAlign: 'center' },
  acctCard: { flexDirection: 'row', alignItems: 'center', gap: 16, backgroundColor: colors.white, borderRadius: 18, padding: 16, borderWidth: 1, borderColor: '#E4EEF3' },
  acctName: { fontFamily: fonts.semiBold, fontSize: 15, color: colors.ink },
  acctSub: { fontFamily: fonts.regular, fontSize: 12, color: colors.muted, marginTop: 2 },
  acctBal: { fontFamily: fonts.bold, fontSize: 16, color: colors.primary },
  balanceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#E4F1F8', borderRadius: 16, padding: 16 },
  balanceLabel: { fontFamily: fonts.regular, fontSize: 12, color: colors.muted },
  balanceAmt: { fontFamily: fonts.bold, fontSize: 18, color: colors.ink },
  dirRow: { flexDirection: 'row', gap: 8 },
  dir: { flex: 1, height: 48, borderRadius: 24, backgroundColor: '#E4F1F8', alignItems: 'center', justifyContent: 'center' },
  dirActive: { backgroundColor: colors.primary },
  dirText: { fontFamily: fonts.semiBold, fontSize: 13, color: colors.primary },
  dirTextActive: { color: colors.white },
  inputRow: { height: 56, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#E4EEF3', borderRadius: 16 },
  input: { flex: 1, fontFamily: fonts.regular, fontSize: 15, color: colors.ink },
  peso: { fontFamily: fonts.medium, fontSize: 16, color: colors.muted },
  error: { fontFamily: fonts.semiBold, fontSize: 13, color: '#EF4444', textAlign: 'center' },
  cta: { minHeight: 56, borderRadius: 28, backgroundColor: '#006199', alignItems: 'center', justifyContent: 'center' },
  ctaText: { fontFamily: fonts.semiBold, fontSize: 16, color: '#FFFFFF' },
});
