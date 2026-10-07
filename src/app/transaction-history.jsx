import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { IOSStatusBar } from '../components/IOSStatusBar';
import { BottomNav, ScreenHeader, SearchBar } from '../components/ui';
import { SwipeableTxRow } from '../components/SwipeableTxRow';
import { colors, fonts } from '../theme';
import { getTransactions } from '../services/db';

const DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function Calendar({ year, month, selected, onSelect }) {
  const first = new Date(year, month, 1).getDay();
  const days = new Date(year, month + 1, 0).getDate();
  const cells = [...Array(first).fill(null), ...Array.from({ length: days }, (_, i) => i + 1)];
  while (cells.length % 7 !== 0) cells.push(null);
  return (
    <View style={c.card}>
      <View style={c.head}>
        <Pressable onPress={() => onSelect?.('prev')} hitSlop={12} accessibilityRole="button" accessibilityLabel="Previous month">
          <Feather name="chevron-left" size={22} color={colors.primary} />
        </Pressable>
        <Text style={c.title}>{MONTHS[month]} {year}</Text>
        <Pressable onPress={() => onSelect?.('next')} hitSlop={12} accessibilityRole="button" accessibilityLabel="Next month">
          <Feather name="chevron-right" size={22} color={colors.primary} />
        </Pressable>
      </View>
      <View style={c.grid}>
        {DAYS.map((d, i) => (
          <Text key={i} style={c.dow}>{d}</Text>
        ))}
        {cells.map((day, i) => (
          <Pressable
            key={i}
            style={[c.cell, day === selected && c.selected]}
            onPress={() => day && onSelect?.(day)}
            disabled={!day}
            accessibilityRole="button"
            accessibilityLabel={day ? `Select day ${day}` : 'Empty'}
          >
            <Text style={[c.day, day === selected && c.daySelected]}>{day ?? ''}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const c = StyleSheet.create({
  card: { backgroundColor: colors.white, borderRadius: 18, padding: 16, borderWidth: 1, borderColor: '#E4EEF3' },
  head: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  title: { fontFamily: fonts.bold, fontSize: 16, color: colors.ink },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  dow: { width: '14.28%', textAlign: 'center', fontFamily: fonts.semiBold, fontSize: 12, color: colors.muted, marginBottom: 8 },
  cell: { width: '14.28%', aspectRatio: 1, alignItems: 'center', justifyContent: 'center', borderRadius: 999 },
  selected: { backgroundColor: '#006199' },
  day: { fontFamily: fonts.medium, fontSize: 14, color: colors.ink },
  daySelected: { color: '#FFFFFF', fontWeight: '700' },
});

export default function TransactionHistory() {
  const [month, setMonth] = useState(5);
  const [selected, setSelected] = useState(15);
  const [search, setSearch] = useState('');
  const [rows, setRows] = useState(() => getTransactions(''));

  const load = (q = '') => setRows(getTransactions(q));

  const onSearch = (text) => { setSearch(text); load(text); };

  const onSelect = (v) => {
    if (v === 'prev') setMonth((m) => (m + 11) % 12);
    else if (v === 'next') setMonth((m) => (m + 1) % 12);
    else setSelected(v);
  };

  return (
    <View style={styles.safe}>
      <SafeAreaView style={{ backgroundColor: '#006199' }} edges={[]}>
        <IOSStatusBar light />
        <ScreenHeader title="Transaction History" onBack={() => router.replace('/(tabs)')} right="search" onRight={() => {}} />
      </SafeAreaView>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.sheet} showsVerticalScrollIndicator={false}>
        <SearchBar value={search} onChangeText={onSearch} placeholder="Search transactions..." />
        <Calendar year={2021} month={month} selected={selected} onSelect={onSelect} />
        <View style={styles.rowBetween}>
          <Text style={styles.section}>Transaction Summary</Text>
          <Pressable onPress={() => router.push('/transactions')}>
            <Text style={styles.seeAll}>See All</Text>
          </Pressable>
        </View>
        <View style={styles.card}>
          {rows.slice(0, 5).map((t, i, arr) => (
            <SwipeableTxRow key={t.id} id={t.id} title={t.title} sub={t.sub} amount={t.amount} icon={t.icon} last={i === arr.length - 1} />
          ))}
        </View>
        <Text style={styles.hint}>Showing activity around June {selected}, 2021 (mock dates).</Text>
      </ScrollView>
      <BottomNav active="home" />
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#006199' },
  scroll: { flex: 1, backgroundColor: '#F3F7FA', borderTopLeftRadius: 24, borderTopRightRadius: 24, marginTop: -20, overflow: 'hidden' },
  sheet: { padding: 16, gap: 16, paddingBottom: 32 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  section: { fontFamily: fonts.bold, fontSize: 17, color: colors.ink },
  seeAll: { fontFamily: fonts.semiBold, fontSize: 13, color: colors.primary },
  card: { backgroundColor: '#FFFFFF', borderRadius: 18, paddingHorizontal: 16, borderWidth: 1, borderColor: '#E4EEF3' },
  hint: { fontFamily: fonts.regular, fontSize: 12, color: colors.muted, textAlign: 'center' },
});