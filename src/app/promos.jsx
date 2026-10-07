import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { IOSStatusBar } from '../components/IOSStatusBar';
import { BottomNav, ScreenHeader } from '../components/ui';
import { colors, fonts } from '../theme';

const PROMOS = [
  { tag: 'Bills', title: '₱50 cashback on your next bill payment', sub: 'Use Pay Bills · one per account · ends Oct 31', accent: '#006199' },
  { tag: 'Load', title: 'Buy ₱100 load, get 1% back in points', sub: 'TM / TNT / Smart / Globe / DITO', accent: '#00456E' },
  { tag: 'Transfer', title: 'Free transfers to Maharlika wallets', sub: '0% fee on Send to self-linked accounts', accent: '#0F4E7E' },
];

export default function Promos() {
  return (
    <View style={styles.safe}>
      <SafeAreaView style={{ backgroundColor: '#006199' }} edges={[]}>
        <IOSStatusBar light />
        <ScreenHeader title="Promos" />
      </SafeAreaView>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.sheet} showsVerticalScrollIndicator={false}>
        {PROMOS.map((p, i) => (
          <View key={i} style={styles.card}>
            <View style={[styles.tag, { backgroundColor: p.accent }]}>
              <Text style={styles.tagText}>{p.tag}</Text>
            </View>
            <Text style={styles.title}>{p.title}</Text>
            <Text style={styles.sub}>{p.sub}</Text>
            <Pressable style={styles.claim} onPress={() => router.push('/(tabs)/bills')} accessibilityRole="button" accessibilityLabel="Claim promo">
              <Text style={styles.claimText}>See it in Pay Bills</Text>
            </Pressable>
          </View>
        ))}
        <Text style={styles.hint}>Demo promos only · no real offers apply.</Text>
      </ScrollView>
      <BottomNav active="home" />
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#006199' },
  scroll: { flex: 1, backgroundColor: '#F3F7FA', borderTopLeftRadius: 24, borderTopRightRadius: 24, marginTop: -20, overflow: 'hidden' },
  sheet: { padding: 16, gap: 16, paddingBottom: 32 },
  card: { backgroundColor: colors.white, borderRadius: 18, padding: 16, borderWidth: 1, borderColor: '#E4EEF3', gap: 6 },
  tag: { alignSelf: 'flex-start', borderRadius: 999, paddingHorizontal: 12, paddingVertical: 4, marginBottom: 4 },
  tagText: { fontFamily: fonts.semiBold, fontSize: 11, color: '#FFFFFF' },
  title: { fontFamily: fonts.bold, fontSize: 16, color: colors.ink },
  sub: { fontFamily: fonts.regular, fontSize: 13, color: colors.muted },
  claim: { height: 44, borderRadius: 22, borderWidth: 1.5, borderColor: '#006199', alignItems: 'center', justifyContent: 'center', marginTop: 8 },
  claimText: { fontFamily: fonts.semiBold, fontSize: 13, color: '#006199' },
  hint: { fontFamily: fonts.regular, fontSize: 12, color: colors.muted, textAlign: 'center' },
});
