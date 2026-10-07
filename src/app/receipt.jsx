import { useRef } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import * as Sharing from 'expo-sharing';
import { IOSStatusBar } from '../components/IOSStatusBar';
import { BillerAvatar, ZigZag } from '../components/ui';
import { colors, fonts } from '../theme';
import { formatPeso } from '../store';
import { maskAccount } from '../utils/money';

// react-native-view-shot is NOT bundled in Expo Go: a static import crashes the
// whole app there at startup. Guarded require keeps Expo Go bootable (it falls
// back to text share); development builds get full image capture.
let ViewShot = null;
try {
  ViewShot = require('react-native-view-shot').default;
} catch {
  ViewShot = null;
}

export default function Receipt() {
  const params = useLocalSearchParams();
  const name = typeof params.name === 'string' ? params.name : 'Meralco';
  const amount = parseFloat(typeof params.amount === 'string' ? params.amount : '1298') || 1298;
  const ref = typeof params.ref === 'string' ? params.ref : 'MK-20261005-093842';
  const account = typeof params.account === 'string' ? params.account : '1234567890';
  const initial = typeof params.initial === 'string' ? params.initial : name.charAt(0).toUpperCase();
  const color = typeof params.color === 'string' ? params.color : '#E07B39';
  const date = 'Oct 05, 2026 · 9:41 AM';
  const shotRef = useRef(null);
  const Shot = ViewShot ?? View;

  const share = async () => {
    try {
      const uri = await shotRef.current?.capture?.();
      if (uri && (await Sharing.isAvailableAsync())) {
        await Sharing.shareAsync(uri);
        return;
      }
    } catch {
      // fall through to text share
    }
    const { Share } = await import('react-native');
    Share.share({ message: `Maharlika receipt — ${name} · ${formatPeso(amount)} · ${ref} · ${date}` });
  };

  return (
    <View style={styles.safe}>
      <SafeAreaView style={{ backgroundColor: '#006199' }} edges={[]}>
        <IOSStatusBar light />
        <View style={styles.header}>
          <Pressable onPress={() => router.replace('/(tabs)')} hitSlop={8} accessibilityRole="button">
            <Feather name="arrow-left" size={24} color="#FFFFFF" />
          </Pressable>
          <Text style={styles.title}>Example Bill Payment Receipt</Text>
          <Pressable onPress={share} hitSlop={8} accessibilityRole="button">
            <Feather name="more-horizontal" size={24} color="#FFFFFF" />
          </Pressable>
        </View>
      </SafeAreaView>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.sheet} showsVerticalScrollIndicator={false}>
        <Shot ref={shotRef} options={{ format: 'png', quality: 0.9 }} style={styles.shot}>
        <View style={styles.card}>
          <ZigZag />
          <BillerAvatar initial={initial} color={color} size={52} />
          <View style={styles.okRow}>
            <Feather name="check-circle" size={22} color="#16A34A" />
            <Text style={styles.ok}>Successful!</Text>
          </View>
          <Text style={styles.done}>Your bill payment is complete.</Text>
          <View style={styles.meta}>
            <View style={styles.metaRow}>
              <Text style={styles.k}>Biller</Text>
              <Text style={styles.v}>{name}</Text>
            </View>
            <View style={styles.metaRow}>
              <Text style={styles.k}>Account No.</Text>
              <Text style={styles.v}>{maskAccount(account)}</Text>
            </View>
            <View style={styles.metaRow}>
              <Text style={styles.k}>Transaction ID</Text>
              <Text style={styles.v}>{ref}</Text>
            </View>
            <View style={styles.metaRow}>
              <Text style={styles.k}>Date and time</Text>
              <Text style={styles.v}>{date}</Text>
            </View>
            <View style={styles.metaRow}>
              <Text style={styles.k}>Amount</Text>
              <Text style={styles.amt}>{formatPeso(amount)}</Text>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.barcode}>
            {Array.from({ length: 48 }).map((_, i) => (
              <View key={i} style={[styles.bar, { width: (i % 4) + 1, opacity: i % 5 === 0 ? 0.35 : 1 }]} />
            ))}
          </View>
          <Text style={styles.barNum}>{ref.replace(/-/g, ' ')}</Text>
        </View>
        </Shot>
        <Pressable onPress={share} style={styles.cta} accessibilityRole="button">
          <Feather name="share-2" size={18} color="#FFFFFF" />
          <Text style={styles.ctaText}>Share Receipt</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#006199' },
  header: { flexDirection: 'row', alignItems: 'center', gap: 16, paddingHorizontal: 24, paddingTop: 8, paddingBottom: 32, backgroundColor: '#006199' },
  title: { fontFamily: fonts.bold, fontSize: 22, lineHeight: 28, color: '#FFFFFF', flex: 1 },
  scroll: { flex: 1, backgroundColor: '#F3F7FA', borderTopLeftRadius: 24, borderTopRightRadius: 24, marginTop: -20, overflow: 'hidden' },
  sheet: { flexGrow: 1, padding: 16, gap: 16 },
  card: { backgroundColor: colors.white, borderRadius: 20, padding: 24, paddingTop: 16, alignItems: 'center', borderWidth: 1, borderColor: '#E4EEF3' },
  shot: { borderRadius: 20 },
  okRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 16 },
  ok: { fontFamily: fonts.bold, fontSize: 22, color: '#16A34A' },
  done: { fontFamily: fonts.regular, fontSize: 13, color: colors.muted, marginTop: 4 },
  meta: { alignSelf: 'stretch', marginTop: 24, gap: 16 },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  k: { fontFamily: fonts.regular, fontSize: 12, color: colors.muted },
  v: { fontFamily: fonts.medium, fontSize: 12, color: colors.ink },
  amt: { fontFamily: fonts.bold, fontSize: 20, color: colors.ink },
  divider: { height: 1, alignSelf: 'stretch', backgroundColor: '#E4EEF3', marginTop: 24 },
  barcode: { flexDirection: 'row', alignItems: 'flex-end', gap: 2, height: 52, marginTop: 16 },
  bar: { height: 52, backgroundColor: colors.ink },
  barNum: { fontFamily: fonts.regular, fontSize: 10, color: colors.muted, letterSpacing: 1, marginTop: 8 },
  cta: { height: 56, borderRadius: 28, backgroundColor: '#006199', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  ctaText: { fontFamily: fonts.semiBold, fontSize: 16, color: colors.white },
});
