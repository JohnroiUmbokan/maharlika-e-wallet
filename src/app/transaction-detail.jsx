import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { IOSStatusBar } from '../components/IOSStatusBar';
import { BottomNav, ScreenHeader, ZigZag } from '../components/ui';
import { MLogo } from '../components/MLogo';
import { colors, fonts } from '../theme';
import { formatPeso, formatSigned, useStore } from '../store';

export default function TransactionDetail() {
  const params = useLocalSearchParams();
  const { transactions } = useStore();
  const id = typeof params.id === 'string' ? params.id : '';
  const t = transactions.find((x) => x.id === id);

  return (
    <View style={styles.safe}>
      <SafeAreaView style={{ backgroundColor: '#006199' }} edges={[]}>
        <IOSStatusBar light />
        <ScreenHeader title="Transaction Detail" />
      </SafeAreaView>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.sheet} showsVerticalScrollIndicator={false}>
        {!t ? (
          <View style={styles.card}>
            <Text style={styles.missing}>Transaction not found. It may have been deleted.</Text>
            <Pressable style={styles.done} onPress={() => router.back()} accessibilityRole="button">
              <Text style={styles.doneText}>Go Back</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.card}>
            <ZigZag />
            <MLogo />
            <View style={styles.okRow}>
              <Feather name="check-circle" size={22} color="#16A34A" />
              <Text style={styles.ok}>Successful</Text>
            </View>
            <Text style={[styles.amount, { color: t.amount < 0 ? '#EF4444' : '#16A34A' }]}>
              {formatSigned(t.amount)}
            </Text>
            <Text style={styles.title}>{t.title}</Text>
            <View style={styles.rows}>
              <Row k="Description" v={t.title} />
              <Row k="Details" v={t.sub} />
              <Row k="Type" v={labelFor(t.kind)} />
              <Row k="Transaction ID" v={t.id} />
              <Row k="Amount" v={formatPeso(Math.abs(t.amount))} strong />
            </View>
            <Pressable style={styles.done} onPress={() => router.back()} accessibilityRole="button" accessibilityLabel="Done">
              <Text style={styles.doneText}>Done</Text>
            </Pressable>
          </View>
        )}
      </ScrollView>
      <BottomNav active="home" />
    </View>
  );
}

function labelFor(kind) {
  if (kind === 'sent') return 'Send Money';
  if (kind === 'received') return 'Receive';
  if (kind === 'bills') return 'Bills Payment';
  return 'Transaction';
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
  okRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 12 },
  ok: { fontFamily: fonts.bold, fontSize: 20, color: '#16A34A' },
  amount: { fontFamily: fonts.bold, fontSize: 30, marginTop: 8 },
  title: { fontFamily: fonts.semiBold, fontSize: 15, color: colors.ink, marginTop: 4 },
  rows: { alignSelf: 'stretch', marginTop: 16, gap: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between', gap: 16 },
  k: { fontFamily: fonts.regular, fontSize: 12, color: colors.muted },
  v: { fontFamily: fonts.medium, fontSize: 13, color: colors.ink, textAlign: 'right', flex: 1 },
  strong: { fontFamily: fonts.bold, fontSize: 16 },
  missing: { fontFamily: fonts.regular, fontSize: 14, color: colors.muted, textAlign: 'center' },
  done: { minHeight: 52, borderRadius: 26, backgroundColor: '#006199', alignItems: 'center', justifyContent: 'center', alignSelf: 'stretch', marginTop: 20 },
  doneText: { fontFamily: fonts.semiBold, fontSize: 16, color: '#FFFFFF' },
});
