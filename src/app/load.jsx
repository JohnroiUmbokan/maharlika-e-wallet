import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { IOSStatusBar } from '../components/IOSStatusBar';
import { BottomNav, Label, ScreenHeader } from '../components/ui';
import { colors, fonts } from '../theme';
import { formatPeso } from '../store';

const DENOMS = [13, 30, 50, 100, 300, 500, 1000];
const SIMS = ['TM', 'TNT', 'Smart', 'Globe', 'DITO'];

export default function Load() {
  const [number, setNumber] = useState('');
  const [amount, setAmount] = useState(null);
  const [sim, setSim] = useState('TM');
  const [error, setError] = useState('');

  const buy = () => {
    if (!/^09\d{9}$/.test(number)) return setError('Enter an 11-digit mobile number starting with 09.');
    if (amount == null) return setError('Choose a load amount.');
    setError('');
    router.push({ pathname: '/bill-confirmation', params: { billerId: 'b5', accountNo: number, amount: String(amount) } });
  };

  return (
    <View style={styles.safe}>
      <SafeAreaView style={{ backgroundColor: '#006199' }} edges={[]}>
        <IOSStatusBar light />
        <ScreenHeader title="Buy Load" />
      </SafeAreaView>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.sheet} showsVerticalScrollIndicator={false}>
        <Label>Network</Label>
        <View style={styles.denoms}>
          {SIMS.map((c) => (
            <Pressable key={c} style={[styles.denom, sim === c && styles.denomActive]} onPress={() => setSim(c)} accessibilityRole="button" accessibilityLabel={c}>
              <Text style={[styles.denomText, sim === c && styles.denomTextActive]}>{c}</Text>
            </Pressable>
          ))}
        </View>
        <Label>Mobile Number</Label>
        <View style={styles.inputRow}>
          <TextInput value={number} onChangeText={(t) => { setNumber(t.replace(/[^0-9]/g, '').slice(0, 11)); setError(''); }} placeholder="09XX XXX XXXX" placeholderTextColor="#64748B" keyboardType="numeric" style={styles.input} />
        </View>
        <Label>Choose Amount</Label>
        <View style={styles.denoms}>
          {DENOMS.map((d) => (
            <Pressable key={d} style={[styles.denom, amount === d && styles.denomActive]} onPress={() => { setAmount(d); setError(''); }} accessibilityRole="button" accessibilityLabel={`₱${d}`}>
              <Text style={[styles.denomText, amount === d && styles.denomTextActive]}>{formatPeso(d)}</Text>
            </Pressable>
          ))}
        </View>
        {!!error && <Text style={styles.error} accessibilityRole="alert">{error}</Text>}
        <Pressable style={styles.cta} onPress={buy} accessibilityRole="button" accessibilityLabel="Continue to pay">
          <Text style={styles.ctaText}>Continue</Text>
        </Pressable>
      </ScrollView>
      <BottomNav active="bills" />
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#006199' },
  scroll: { flex: 1, backgroundColor: '#F3F7FA', borderTopLeftRadius: 24, borderTopRightRadius: 24, marginTop: -20, overflow: 'hidden' },
  sheet: { padding: 16, gap: 12, paddingBottom: 24 },
  inputRow: { height: 64, paddingHorizontal: 16, justifyContent: 'center', backgroundColor: '#E4EEF3', borderRadius: 16 },
  input: { fontFamily: fonts.medium, fontSize: 18, color: colors.ink },
  denoms: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  denom: { minWidth: 96, paddingHorizontal: 16, height: 52, borderRadius: 16, backgroundColor: '#E4F1F8', alignItems: 'center', justifyContent: 'center' },
  denomActive: { backgroundColor: '#006199' },
  denomText: { fontFamily: fonts.semiBold, fontSize: 14, color: '#006199' },
  denomTextActive: { color: '#FFFFFF' },
  error: { fontFamily: fonts.semiBold, fontSize: 13, color: '#EF4444', textAlign: 'center' },
  cta: { minHeight: 56, borderRadius: 28, backgroundColor: '#006199', alignItems: 'center', justifyContent: 'center' },
  ctaText: { fontFamily: fonts.semiBold, fontSize: 16, color: '#FFFFFF' },
});
