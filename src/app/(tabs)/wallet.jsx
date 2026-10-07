import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useState } from 'react';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { IOSStatusBar } from '../../components/IOSStatusBar';
import { BillerAvatar, ModalSheet, ScreenHeader } from '../../components/ui';
import { SwipeableTxRow } from '../../components/SwipeableTxRow';
import { colors, fonts } from '../../theme';
import { formatPeso, useStore } from '../../store';

const KINDS = ['Bank', 'E-Wallet'];

export default function Wallet() {
  const { balance, linked, addLinked, topUp, cashOut, transactions } = useStore();
  const [modal, setModal] = useState(false);
  const [kind, setKind] = useState('Bank');
  const [name, setName] = useState('');
  const [last4, setLast4] = useState('');
  const [cashMode, setCashMode] = useState(null); // 'in' | 'out' | null
  const [cashAmount, setCashAmount] = useState('');
  const [cashMsg, setCashMsg] = useState('');
  const [cashPlace, setCashPlace] = useState('7-Eleven');
  const CASH_PLACES = ['7-Eleven', 'Sari-sari Store', 'Cebuana', 'Palawan Express', 'Bank Branch'];

  const banks = linked.filter((l) => l.balance > 0);
  const cards = linked;

  const save = () => {
    if (!name.trim()) return Alert.alert('Missing info', 'Enter the account name.');
    if (!/^\d{6,19}$/.test(last4.trim())) return Alert.alert('Missing info', 'Enter the full account number (6–19 digits).');
    const initial = name.trim().charAt(0).toUpperCase();
    const entry = {
      name: name.trim(),
      detail: `last 4 digits ${last4.trim().slice(-4)}`,
      balance: kind === 'Bank' ? 1500 : 0,
      initial,
      color: kind === 'Bank' ? '#006199' : '#7C6AB0',
    };
    addLinked(entry);
    setName(''); setLast4(''); setModal(false);
  };

  const submitCash = () => {
    const amt = parseFloat(cashAmount) || 0;
    if (amt <= 0) {
      setCashMsg('Enter an amount greater than ₱0.');
      return;
    }
    if (cashMode === 'in') {
      topUp(amt, cashPlace);
      setCashMsg(`Cashed in ${formatPeso(amt)} via ${cashPlace}.`);
    } else {
      if (!cashOut(amt, cashPlace)) {
        setCashMsg('Insufficient balance.');
        return;
      }
      setCashMsg(`Cashed out ${formatPeso(amt)} via ${cashPlace}.`);
    }
    setCashAmount('');
  };

  return (
    <View style={styles.safe}>
      <SafeAreaView style={{ backgroundColor: '#006199' }} edges={[]}>
        <IOSStatusBar light />
        <ScreenHeader title="Wallet Management" onBack={() => router.replace('/(tabs)')} right="help-circle" onRight={() => Alert.alert('Wallet', 'Your banks and cards in one place.')} />
      </SafeAreaView>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.sheet} showsVerticalScrollIndicator={false}>
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Maharlika Balance</Text>
          <Text style={styles.balanceAmt}>{formatPeso(balance)}</Text>
          <View style={styles.cashRow}>
            <Pressable style={styles.cashBtn} onPress={() => { setCashAmount(''); setCashMsg(''); setCashMode('in'); }} accessibilityRole="button" accessibilityLabel="Cash in">
              <Feather name="arrow-down-left" size={18} color="#FFFFFF" />
              <Text style={styles.cashText}>Cash In</Text>
            </Pressable>
            <Pressable style={[styles.cashBtn, styles.cashOut]} onPress={() => { setCashAmount(''); setCashMsg(''); setCashMode('out'); }} accessibilityRole="button" accessibilityLabel="Cash out">
              <Feather name="arrow-up-right" size={18} color="#FFFFFF" />
              <Text style={styles.cashText}>Cash Out</Text>
            </Pressable>
          </View>
        </View>
        <Text style={styles.section}>Recent Transactions</Text>
        <View style={styles.txCard}>
          {transactions.slice(0, 4).length === 0 && <Text style={styles.txEmpty}>No transactions yet.</Text>}
          {transactions.slice(0, 4).map((t, i, arr) => (
            <SwipeableTxRow key={t.id} id={t.id} title={t.title} sub={t.sub} amount={t.amount} icon={t.icon} last={i === arr.length - 1} />
          ))}
        </View>
        <Pressable onPress={() => router.push('/transactions')} accessibilityRole="button" accessibilityLabel="See all transactions">
          <Text style={styles.seeAll}>See All</Text>
        </Pressable>
        <Text style={styles.section}>Bank Accounts</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.bankRow} snapToInterval={232} decelerationRate="fast">
          {(banks.length ? banks : [{ id: 'x', name: 'Isla Bank', balance: 1500, initial: 'I' }, { id: 'y', name: 'Bayan Bank', balance: 1500, initial: 'B' }]).map((b) => (
            <Pressable key={b.id} style={styles.bankCard} onPress={() => router.push({ pathname: '/link-transfer', params: { id: b.id } })} accessibilityRole="button" accessibilityLabel={`Transfer with ${b.name}`}>
              <View style={styles.bankTop}>
                <BillerAvatar initial={b.initial ?? b.name.charAt(0)} color="#006199" size={32} />
                <Text style={styles.bankName}>{b.name}</Text>
              </View>
              <Text style={styles.availLabel}>Available balance</Text>
              <Text style={styles.bankBal}>{formatPeso(b.balance ?? 1500)}</Text>
            </Pressable>
          ))}
        </ScrollView>
        <Text style={styles.section}>Linked Cards</Text>
        <View style={styles.listCard}>
          {cards.map((c, i) => (
            <Pressable key={c.id} style={[styles.row, i < cards.length - 1 && styles.divider]} onPress={() => router.push({ pathname: '/link-transfer', params: { id: c.id } })} accessibilityRole="button" accessibilityLabel={`Transfer with ${c.name}`}>
              <BillerAvatar initial={c.initial} color={c.color} size={44} />
              <View style={{ flex: 1 }}>
                <Text style={styles.rowTitle}>{c.name}</Text>
                <Text style={styles.rowSub}>{c.detail}</Text>
              </View>
              <Feather name="chevron-right" size={20} color={colors.primary} />
            </Pressable>
          ))}
        </View>
        <Pressable style={styles.linkBtn} onPress={() => setModal(true)}>
          <Text style={styles.linkPlus}>＋</Text>
          <Text style={styles.linkText}>Link a New Account</Text>
        </Pressable>
      </ScrollView>

      <ModalSheet visible={!!cashMode} onClose={() => setCashMode(null)} title={cashMode === 'in' ? 'Cash In' : 'Cash Out'}>
        <Text style={styles.cashPlaceLabel}>Where</Text>
        <View style={styles.denomRow}>
          {CASH_PLACES.map((c) => (
            <Pressable key={c} style={[styles.denomChip, cashPlace === c && styles.denomChipActive]} onPress={() => setCashPlace(c)} accessibilityRole="button" accessibilityLabel={c}>
              <Text style={[styles.denomChipText, cashPlace === c && styles.denomChipTextActive]}>{c}</Text>
            </Pressable>
          ))}
        </View>
        <View style={styles.cashBox}>
          <Text style={styles.cashPeso}>₱</Text>
          <TextInput
            value={cashAmount}
            onChangeText={(t) => { setCashAmount(t.replace(/[^0-9.]/g, '')); setCashMsg(''); }}
            placeholder="0.00"
            placeholderTextColor="#94A3B8"
            keyboardType="numeric"
            style={styles.cashAmount}
          />
        </View>
        {!!cashMsg && <Text style={cashMsg.startsWith('Enter') || cashMsg.startsWith('Insufficient') ? styles.cashErr : styles.cashOk}>{cashMsg}</Text>}
        <Pressable style={styles.cta} onPress={submitCash} accessibilityRole="button" accessibilityLabel={cashMode === 'in' ? 'Confirm cash in' : 'Confirm cash out'}>
          <Text style={styles.ctaText}>{cashMode === 'in' ? 'Cash In' : 'Cash Out'}</Text>
        </Pressable>
      </ModalSheet>

      <ModalSheet visible={modal} onClose={() => setModal(false)} title="Link a New Account">
        <View style={styles.kinds}>
          {KINDS.map((k) => (
            <Pressable key={k} onPress={() => setKind(k)} style={[styles.kind, kind === k && styles.kindActive]} accessibilityRole="button" accessibilityLabel={k}>
              <Text style={[styles.kindText, kind === k && styles.kindTextActive]}>{k}</Text>
            </Pressable>
          ))}
        </View>
        <View style={styles.inputRow}>
          <TextInput value={name} onChangeText={setName} placeholder={kind === 'Bank' ? 'Bank name (e.g. BDO Visa)' : 'E-Wallet name (e.g. Suki Wallet)'} placeholderTextColor="#64748B" style={styles.input} />
        </View>
        <View style={styles.inputRow}>
          <TextInput value={last4} onChangeText={(t) => setLast4(t.replace(/[^0-9]/g, '').slice(0, 19))} placeholder={kind === 'Bank' ? 'Full account / card number' : 'Wallet account number / mobile'} placeholderTextColor="#64748B" style={styles.input} keyboardType="numeric" />
        </View>
        <Pressable style={styles.cta} onPress={save} accessibilityRole="button" accessibilityLabel="Link account">
          <Text style={styles.ctaText}>Link Account</Text>
        </Pressable>
      </ModalSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#006199' },
  scroll: { flex: 1, backgroundColor: '#F3F7FA', borderTopLeftRadius: 24, borderTopRightRadius: 24, marginTop: -20, overflow: 'hidden' },
  sheet: { padding: 16, gap: 16, paddingBottom: 32 },
  section: { fontFamily: fonts.bold, fontSize: 18, color: colors.ink },
  balanceCard: { backgroundColor: '#006199', borderRadius: 20, padding: 20, gap: 4 },
  balanceLabel: { fontFamily: fonts.medium, fontSize: 13, color: 'rgba(255,255,255,0.8)' },
  balanceAmt: { fontFamily: fonts.bold, fontSize: 32, color: colors.white },
  cashRow: { flexDirection: 'row', gap: 12, marginTop: 12 },
  cashBtn: { flex: 1, height: 52, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.16)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.35)', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  cashOut: { backgroundColor: 'rgba(0,0,0,0.18)' },
  cashText: { fontFamily: fonts.semiBold, fontSize: 15, color: colors.white },
  cashErr: { fontFamily: fonts.semiBold, fontSize: 13, color: '#EF4444', textAlign: 'center' },
  cashBox: { minHeight: 88, borderRadius: 16, backgroundColor: '#E4EEF3', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, gap: 8 },
  cashPeso: { fontFamily: fonts.bold, fontSize: 32, color: colors.ink },
  cashAmount: { flex: 1, fontFamily: fonts.bold, fontSize: 32, color: colors.ink, paddingVertical: 0 },
  cashOk: { fontFamily: fonts.semiBold, fontSize: 13, color: '#16A34A', textAlign: 'center' },
  cashPlaceLabel: { fontFamily: fonts.bold, fontSize: 13, color: colors.ink, marginBottom: 8 },
  denomRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  denomChip: { paddingHorizontal: 12, height: 40, borderRadius: 20, backgroundColor: '#E4F1F8', alignItems: 'center', justifyContent: 'center' },
  denomChipActive: { backgroundColor: colors.primary },
  denomChipText: { fontFamily: fonts.semiBold, fontSize: 12, color: colors.primary },
  denomChipTextActive: { color: colors.white },
  peso: { fontFamily: fonts.medium, fontSize: 16, color: colors.muted },
  txCard: { backgroundColor: '#FFFFFF', borderRadius: 18, paddingHorizontal: 16, borderWidth: 1, borderColor: '#E4EEF3' },
  txEmpty: { fontFamily: fonts.regular, fontSize: 13, color: colors.muted, textAlign: 'center', paddingVertical: 24 },
  seeAll: { fontFamily: fonts.semiBold, fontSize: 13, color: colors.primary, textAlign: 'right' },
  bankRow: { gap: 16, paddingRight: 16 },
  bankCard: { width: 216, backgroundColor: '#E4F1F8', borderRadius: 18, padding: 16, gap: 4 },
  bankTop: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  bankName: { fontFamily: fonts.semiBold, fontSize: 14, color: colors.ink },
  availLabel: { fontFamily: fonts.regular, fontSize: 11, color: colors.muted, marginTop: 8 },
  bankBal: { fontFamily: fonts.bold, fontSize: 22, color: colors.primary },
  listCard: { backgroundColor: colors.white, borderRadius: 18, paddingHorizontal: 16, borderWidth: 1, borderColor: '#E4EEF3' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 16, paddingVertical: 16 },
  divider: { borderBottomWidth: 1, borderBottomColor: '#E4EEF3' },
  rowTitle: { fontFamily: fonts.semiBold, fontSize: 15, color: colors.ink },
  rowSub: { fontFamily: fonts.regular, fontSize: 12, color: colors.muted, marginTop: 2 },
  linkBtn: { height: 56, borderRadius: 16, backgroundColor: '#CFE4F0', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  linkPlus: { fontSize: 22, color: colors.primary, fontFamily: fonts.regular },
  linkText: { fontFamily: fonts.semiBold, fontSize: 15, color: colors.primary },
  kinds: { flexDirection: 'row', gap: 8 },
  kind: { flex: 1, height: 48, borderRadius: 24, backgroundColor: '#E4F1F8', alignItems: 'center', justifyContent: 'center' },
  kindActive: { backgroundColor: colors.primary },
  kindText: { fontFamily: fonts.semiBold, fontSize: 14, color: colors.primary },
  kindTextActive: { color: colors.white },
  inputRow: { height: 56, paddingHorizontal: 16, backgroundColor: '#E4EEF3', borderRadius: 16, justifyContent: 'center' },
  input: { fontFamily: fonts.regular, fontSize: 15, color: colors.ink },
  cta: { height: 56, borderRadius: 28, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  ctaText: { fontFamily: fonts.semiBold, fontSize: 16, color: colors.white },
});
