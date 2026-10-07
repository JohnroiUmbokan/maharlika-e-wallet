import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IOSStatusBar } from '../components/IOSStatusBar';
import { ScreenHeader, SearchBar } from '../components/ui';
import { SwipeableTxRow } from '../components/SwipeableTxRow';
import { colors, fonts } from '../theme';
import { useStore } from '../store';

const FILTERS = ['All', 'Sent', 'Received', 'Bills'];

export default function Transactions() {
  const { transactions } = useStore();
  const [filter, setFilter] = useState('All');
  const [q, setQ] = useState('');

  const list = transactions.filter((t) => {
    if (filter !== 'All' && t.kind !== filter.toLowerCase()) return false;
    if (q && !`${t.title} ${t.sub}`.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });

  return (
    <View style={styles.safe}>
      <SafeAreaView style={{ backgroundColor: '#006199' }} edges={[]}>
        <IOSStatusBar light />
        <ScreenHeader title="Transactions" right="sliders" onRight={() => setFilter('All')} />
      </SafeAreaView>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.sheet} showsVerticalScrollIndicator={false}>
        <SearchBar value={q} onChangeText={setQ} placeholder="Search transactions" />
        <View style={styles.filters}>
          {FILTERS.map((f) => {
            const active = f === filter;
            return (
              <Pressable key={f} style={[styles.chip, { backgroundColor: active ? colors.primary : '#E4F1F8' }]} onPress={() => setFilter(f)}>
                <Text style={[styles.chipText, { color: active ? colors.white : colors.primary }]}>{f}</Text>
              </Pressable>
            );
          })}
        </View>
        <View style={styles.rowBetween}>
          <Text style={styles.heading}>Latest activity</Text>
          <Text style={styles.range}>Oct 2026</Text>
        </View>
        <View style={styles.card}>
          {list.length === 0 && <Text style={styles.empty}>No transactions match.</Text>}
          {list.map((t, i) => (
            <SwipeableTxRow key={t.id} id={t.id} title={t.title} sub={t.sub} amount={t.amount} icon={t.icon} last={i === list.length - 1} />
          ))}
        </View>
        <Text style={styles.done}>You&apos;re all caught up.</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#006199' },
  scroll: { flex: 1, backgroundColor: '#F3F7FA', borderTopLeftRadius: 24, borderTopRightRadius: 24, marginTop: -20, overflow: 'hidden' },
  sheet: { padding: 16, gap: 16, paddingBottom: 32 },
  filters: { flexDirection: 'row', gap: 8 },
  chip: { flex: 1, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  chipText: { fontFamily: fonts.semiBold, fontSize: 13 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  heading: { fontFamily: fonts.semiBold, fontSize: 13, color: colors.muted },
  range: { fontFamily: fonts.regular, fontSize: 12, color: colors.muted },
  card: { backgroundColor: '#FFFFFF', borderRadius: 18, paddingHorizontal: 16, borderWidth: 1, borderColor: '#E4EEF3' },
  empty: { fontFamily: fonts.regular, fontSize: 13, color: colors.muted, textAlign: 'center', paddingVertical: 24 },
  done: { fontFamily: fonts.regular, fontSize: 12, color: colors.muted, textAlign: 'center' },
});
