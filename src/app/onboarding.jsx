import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { IOSStatusBar } from '../components/IOSStatusBar';
import { MLogo } from '../components/MLogo';
import { colors, fonts } from '../theme';

export default function Onboarding() {
  return (
    <LinearGradient colors={['#006199', '#00456E']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.bg}>
      {/* faint leaf-pattern overlay */}
      <View style={styles.leaf1} />
      <View style={styles.leaf2} />
      <View style={styles.leaf3} />
      <SafeAreaView style={styles.safe} edges={[]}>
        <IOSStatusBar light />
        <View style={styles.content}>
          <MLogo light />
          <Text style={styles.h1}>Send. Pay. Save.{'\n'}All in Maharlika.</Text>
          <Text style={styles.sub}>Your everyday wallet. Your next big dream.</Text>
          <View style={styles.cards}>
            <View style={[styles.card, styles.backCard]} />
            <View style={[styles.card, styles.frontCard]}>
              <View style={styles.cardTop}>
                <View style={styles.cardBrandRow}>
                  <Text style={styles.cardM}>M</Text>
                  <Text style={styles.cardBrand}>Maharlika</Text>
                </View>
              </View>
              <View style={styles.chip} />
              <Text style={styles.dots}>••••ㅤ••••ㅤ••••ㅤ0824</Text>
              <View style={styles.cardBottom}>
                <Text style={styles.cardName}>JUAN DELA CRUZ</Text>
                <View style={styles.mcRow}>
                  <View style={[styles.mc, { opacity: 0.9 }]} />
                  <View style={[styles.mc, { marginLeft: -14, opacity: 0.6 }]} />
                </View>
              </View>
            </View>
          </View>
          <Pressable onPress={() => router.replace('/(tabs)')} style={styles.cta}>
            <Text style={styles.ctaText}>Get Started</Text>
          </Pressable>
          <Pressable onPress={() => router.push('/login')} style={styles.loginBtn}>
            <Text style={styles.loginText}>Login</Text>
          </Pressable>
          <View style={styles.homeBar} />
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
  leaf1: { position: 'absolute', right: -60, top: -60, width: 220, height: 220, borderRadius: 110, backgroundColor: 'rgba(255,255,255,0.06)' },
  leaf2: { position: 'absolute', right: 40, top: 120, width: 140, height: 140, borderRadius: 70, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.08)' },
  leaf3: { position: 'absolute', left: -70, bottom: -70, width: 200, height: 200, borderRadius: 100, backgroundColor: 'rgba(255,255,255,0.05)' },
  safe: { flex: 1 },
  content: { flex: 1, paddingHorizontal: 24, paddingTop: 16, paddingBottom: 28 },
  h1: { fontFamily: fonts.bold, fontSize: 34, lineHeight: 40, color: colors.white, marginTop: 24 },
  sub: { fontFamily: fonts.regular, fontSize: 14, color: 'rgba(255,255,255,0.72)', marginTop: 10 },
  cards: { height: 250, alignItems: 'center', justifyContent: 'center', marginTop: 10 },
  card: { position: 'absolute', width: 300, height: 175, borderRadius: 20, padding: 18 },
  backCard: { backgroundColor: '#0C3A57', transform: [{ rotate: '-4deg' }], top: 48, opacity: 0.95 },
  frontCard: { backgroundColor: '#2E7FAE', transform: [{ rotate: '-8deg' }], top: 30, justifyContent: 'space-between' },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between' },
  cardBrandRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  cardM: { fontFamily: fonts.bold, fontSize: 20, color: colors.white },
  cardBrand: { fontFamily: fonts.bold, fontSize: 17, color: colors.white },
  chip: { width: 42, height: 32, borderRadius: 7, backgroundColor: colors.yellow, marginTop: 6 },
  dots: { fontFamily: fonts.medium, fontSize: 13, color: colors.white, letterSpacing: 2, marginTop: 8 },
  cardBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardName: { fontFamily: fonts.medium, fontSize: 11, color: colors.white, letterSpacing: 0.5 },
  mcRow: { flexDirection: 'row' },
  mc: { width: 26, height: 26, borderRadius: 13, backgroundColor: 'rgba(255,255,255,0.85)' },
  cta: { height: 56, borderRadius: 28, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center', marginTop: 10 },
  ctaText: { fontFamily: fonts.semiBold, fontSize: 16, color: '#006199' },
  loginBtn: { height: 48, alignItems: 'center', justifyContent: 'center' },
  loginText: { fontFamily: fonts.medium, fontSize: 16, color: colors.white },
  homeBar: { width: 134, height: 5, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.9)', alignSelf: 'center', marginTop: 16 },
});
