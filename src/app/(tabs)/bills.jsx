import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { IOSStatusBar } from '../../components/IOSStatusBar';
import { BillerAvatar, ModalSheet, ScreenHeader, SearchBar } from '../../components/ui';
import { colors, fonts } from '../../theme';
import { formatPeso, useStore } from '../../store';

export default function Bills() {
  const { billers, addBiller } = useStore();
  const [q, setQ] = useState('');
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ name: '', account: '', amount: '' });
  const [formMsg, setFormMsg] = useState('');
  const filtered = billers.filter((b) => b.name.toLowerCase().includes(q.toLowerCase()));

  const save = () => {
    if (!form.name.trim() || !/^\d{6,}$/.test(form.account.trim())) {
      setFormMsg('Enter a bill name and a 6+ digit account number.');
      return;
    }
    const amount = parseFloat(form.amount) || 0;
    if (form.amount && amount <= 0) {
      setFormMsg('Enter a valid amount.');
      return;
    }
    addBiller({ name: form.name.trim(), meta: `Acc ${form.account.trim()} · Custom bill`, amount, account: form.account.trim() });
    setForm({ name: '', account: '', amount: '' });
    setFormMsg('');
    setAdding(false);
  };

  const open = (b) => {
    if (b.id === 'b5') return router.push('/load');
    router.push({ pathname: '/bill-pay', params: { id: b.id } });
  };

  return (
    <View style={styles.safe}>
      <SafeAreaView style={{ backgroundColor: '#006199' }} edges={[]}>
        <IOSStatusBar light />
        <ScreenHeader title="Pay Bills" onBack={() => router.replace('/(tabs)')} right="settings" onRight={() => router.push('/transactions')} />
      </SafeAreaView>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.sheet} showsVerticalScrollIndicator={false}>
        <SearchBar value={q} onChangeText={setQ} placeholder="Search Biller" />
        <View style={styles.sectionRow}>
          <Text style={styles.section}>Your Bills & Services</Text>
          <Pressable style={styles.addBtn} onPress={() => setAdding(true)} accessibilityRole="button" accessibilityLabel="Add a bill">
            <Feather name="plus" size={16} color="#FFFFFF" />
            <Text style={styles.addText}>Add Bill</Text>
          </Pressable>
        </View>
        {filtered.map((b) => (
          <Pressable key={b.id} style={styles.card} onPress={() => open(b)} accessibilityRole="button" accessibilityLabel={`Open ${b.name}`}>
            <BillerAvatar initial={b.initial} color={b.color} size={48} />
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{b.name}</Text>
              <Text style={styles.meta}>{b.meta}</Text>
            </View>
            <View style={{ alignItems: 'flex-end', gap: 4 }}>
              {b.amount > 0 && <Text style={styles.amt}>{formatPeso(b.amount)}</Text>}
              <Feather name="chevron-right" size={20} color={colors.primary} />
            </View>
          </Pressable>
        ))}
        <Text style={styles.hint}>Tap a bill to pay it, add your own bills, or open Load Purchase to buy prepaid load.</Text>
      </ScrollView>

      <ModalSheet visible={adding} onClose={() => setAdding(false)} title="Add Your Bill">
        <TextInput value={form.name} onChangeText={(t) => { setForm((f) => ({ ...f, name: t })); setFormMsg(''); }} placeholder="Bill name (e.g. PLDT, Water)" placeholderTextColor="#64748B" style={styles.field} />
        <TextInput value={form.account} onChangeText={(t) => { setForm((f) => ({ ...f, account: t.replace(/[^0-9]/g, '') })); setFormMsg(''); }} placeholder="Account number" placeholderTextColor="#64748B" keyboardType="numeric" style={styles.field} />
        <TextInput value={form.amount} onChangeText={(t) => { setForm((f) => ({ ...f, amount: t.replace(/[^0-9.]/g, '') })); setFormMsg(''); }} placeholder="Amount due (₱, optional)" placeholderTextColor="#64748B" keyboardType="numeric" style={styles.field} />
        {!!formMsg && <Text style={styles.err} accessibilityRole="alert">{formMsg}</Text>}
        <Pressable style={styles.saveBtn} onPress={save} accessibilityRole="button" accessibilityLabel="Save bill">
          <Text style={styles.saveText}>Save Bill</Text>
        </Pressable>
      </ModalSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#006199' },
  scroll: { flex: 1, backgroundColor: '#F3F7FA', borderTopLeftRadius: 24, borderTopRightRadius: 24, marginTop: -20, overflow: 'hidden' },
  sheet: { padding: 16, gap: 16, paddingBottom: 32 },
  section: { fontFamily: fonts.bold, fontSize: 18, color: colors.ink, marginTop: 8 },
  sectionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  addBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#006199', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8 },
  addText: { fontFamily: fonts.semiBold, fontSize: 13, color: '#FFFFFF' },
  field: { minHeight: 52, backgroundColor: '#E4EEF3', borderRadius: 12, paddingHorizontal: 14, fontFamily: fonts.regular, fontSize: 15, color: colors.ink, marginBottom: 8 },
  err: { fontFamily: fonts.semiBold, fontSize: 13, color: '#EF4444' },
  saveBtn: { minHeight: 52, borderRadius: 26, backgroundColor: '#006199', alignItems: 'center', justifyContent: 'center', marginTop: 4 },
  saveText: { fontFamily: fonts.semiBold, fontSize: 15, color: '#FFFFFF' },
  card: { flexDirection: 'row', alignItems: 'center', gap: 16, backgroundColor: colors.white, borderRadius: 18, padding: 16, borderWidth: 1, borderColor: '#E4EEF3' },
  name: { fontFamily: fonts.semiBold, fontSize: 15, color: colors.ink },
  meta: { fontFamily: fonts.regular, fontSize: 12, color: colors.muted, marginTop: 2 },
  amt: { fontFamily: fonts.semiBold, fontSize: 13, color: '#006199' },
  hint: { fontFamily: fonts.regular, fontSize: 12, color: colors.muted, textAlign: 'center', marginTop: 8 },
});
