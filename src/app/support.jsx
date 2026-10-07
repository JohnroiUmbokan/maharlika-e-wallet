import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { IOSStatusBar } from '../components/IOSStatusBar';
import { BottomNav, ModalSheet, ScreenHeader } from '../components/ui';
import { colors, fonts } from '../theme';

const TOPICS = [
  {
    icon: 'help-circle',
    title: 'Account & login help',
    body: 'Reset demo data, change password or mobile number in Profile → About Maharlika or Account Interface.',
    detail: 'To change your password or mobile number, open Account Interface from Profile → About Maharlika. To restore the demo, use Reset demo data.',
    actionLabel: 'Open Account Interface',
    action: () => router.push('/account'),
  },
  {
    icon: 'shield',
    title: 'Security settings',
    body: 'Toggle biometric login and 2-step verification in Profile → Security.',
    detail: 'Flip Biometric login (Face ID / fingerprint) and 2-Step Verification on or off. Both are stored locally in the SQLite snapshot.',
    actionLabel: 'Open Security',
    action: () => router.replace('/(tabs)/profile'),
  },
  {
    icon: 'file-text',
    title: 'Bills & loads',
    body: 'Add your own bill or buy prepaid load (TM/TNT/Smart/Globe/DITO) in the Bill Pay tab.',
    detail: 'Go to the Bill Pay tab, tap ＋ Add Bill to register your own bill, or tap Load Purchase for network-specific load packages.',
    actionLabel: 'Open Pay Bills',
    action: () => router.replace('/(tabs)/bills'),
  },
  {
    icon: 'info',
    title: 'App info',
    body: 'Maharlika 1.0.0 (SDK 57) · demo build · no real money moves.',
    detail: 'Maharlika 1.0.0 runs on Expo SDK 57 / React Native 0.86. This is a demo build — amounts are illustrative and reset on Reset demo data.',
  },
];

export default function Support() {
  const [open, setOpen] = useState(null);
  return (
    <View style={styles.safe}>
      <SafeAreaView style={{ backgroundColor: '#006199' }} edges={[]}>
        <IOSStatusBar light />
        <ScreenHeader title="Support" />
      </SafeAreaView>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.sheet} showsVerticalScrollIndicator={false}>
        {TOPICS.map((t, i) => (
          <Pressable key={i} style={styles.card} onPress={() => setOpen(t)} accessibilityRole="button" accessibilityLabel={t.title}>
            <View style={styles.tile}>
              <Feather name={t.icon} size={20} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>{t.title}</Text>
              <Text style={styles.body}>{t.body}</Text>
            </View>
            <Feather name="chevron-right" size={18} color="#64748B" />
          </Pressable>
        ))}
        <Pressable style={styles.cta} onPress={() => router.push('/account')} accessibilityRole="button" accessibilityLabel="Go to account settings">
          <Text style={styles.ctaText}>Go to Account Settings</Text>
        </Pressable>
      </ScrollView>
      <ModalSheet visible={!!open} onClose={() => setOpen(null)} title={open?.title}>
        <Text style={styles.detailBody}>{open?.detail}</Text>
        {open?.action && (
          <Pressable style={styles.cta} onPress={() => { const go = open.action; setOpen(null); go?.(); }} accessibilityRole="button" accessibilityLabel={open?.actionLabel}>
            <Text style={styles.ctaText}>{open?.actionLabel}</Text>
          </Pressable>
        )}
      </ModalSheet>
      <BottomNav active="home" />
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#006199' },
  scroll: { flex: 1, backgroundColor: '#F3F7FA', borderTopLeftRadius: 24, borderTopRightRadius: 24, marginTop: -20, overflow: 'hidden' },
  sheet: { padding: 16, gap: 12, paddingBottom: 32 },
  card: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.white, borderRadius: 18, padding: 16, borderWidth: 1, borderColor: '#E4EEF3' },
  tile: { width: 44, height: 44, borderRadius: 14, backgroundColor: '#E4F1F8', alignItems: 'center', justifyContent: 'center' },
  title: { fontFamily: fonts.semiBold, fontSize: 14, color: colors.ink },
  body: { fontFamily: fonts.regular, fontSize: 13, color: colors.muted, marginTop: 2 },
  detailBody: { fontFamily: fonts.regular, fontSize: 14, color: colors.ink, lineHeight: 20 },
  cta: { minHeight: 56, borderRadius: 28, backgroundColor: '#006199', alignItems: 'center', justifyContent: 'center', marginTop: 8 },
  ctaText: { fontFamily: fonts.semiBold, fontSize: 16, color: '#FFFFFF' },
});
