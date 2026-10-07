import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { IOSStatusBar } from '../../components/IOSStatusBar';
import { BalanceCard } from '../../components/BalanceCard';
import { colors, fonts } from '../../theme';
import { useStore } from '../../store';

const ACTIONS = [
  { label: 'Send Money', icon: 'send', route: '/send' },
  { label: 'Receive', icon: 'download', route: '/generate-qr' },
  { label: 'Pay Bills', icon: 'file-text', route: '/(tabs)/bills' },
  { label: 'More', icon: 'more-horizontal', route: '/(tabs)/wallet' },
];

export default function Home() {
  const { user, notifications } = useStore();
  const unreadCount = (notifications ?? []).filter((n) => n.unread).length;

  return (
    <View style={styles.safe}>
      <SafeAreaView style={{ backgroundColor: '#006199' }} edges={[]}>
        <IOSStatusBar light />
        <View style={styles.header}>
          <View>
            <Text style={styles.hello}>Good morning,</Text>
            <Text style={styles.name}>{user.name}</Text>
          </View>
          <Image source={require('../../../assets/profile-photo.png')} style={styles.avatar} />
        </View>
      </SafeAreaView>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.sheet} showsVerticalScrollIndicator={false}>
        <BalanceCard />
        <View style={styles.actions}>
          {ACTIONS.map((a) => (
            <Pressable key={a.label} style={styles.action} onPress={() => router.push(a.route)} accessibilityRole="button">
              <View style={styles.tile}>
                <Feather name={a.icon} size={22} color={colors.primary} />
              </View>
              <Text style={styles.actionLabel}>{a.label}</Text>
            </Pressable>
          ))}
        </View>
        <View style={styles.sectionRow}>
          <Text style={styles.section}>Quick Access</Text>
          <Text style={styles.seeAll}>More ways to pay, save, connect</Text>
        </View>
        <View style={styles.quickRow}>
          <Pressable style={styles.quickCard} onPress={() => router.push('/notifications')} accessibilityRole="button" accessibilityLabel="Notifications">
            <View style={styles.quickTile}>
              <Feather name="bell" size={22} color={colors.primary} />
              {unreadCount > 0 && <View style={styles.notifDot} />}
            </View>
            <Text style={styles.quickLabel}>Notifications</Text>
          </Pressable>
          <Pressable style={styles.quickCard} onPress={() => router.push('/promos')} accessibilityRole="button" accessibilityLabel="Promos">
            <View style={styles.quickTile}>
              <Feather name="tag" size={22} color={colors.primary} />
            </View>
            <Text style={styles.quickLabel}>Promos</Text>
          </Pressable>
          <Pressable style={styles.quickCard} onPress={() => router.push('/transactions')} accessibilityRole="button" accessibilityLabel="Transactions">
            <View style={styles.quickTile}>
              <Feather name="list" size={22} color={colors.primary} />
            </View>
            <Text style={styles.quickLabel}>Transactions</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#006199' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingTop: 8, paddingBottom: 32, backgroundColor: '#006199' },
  hello: { fontFamily: fonts.regular, fontSize: 13, color: 'rgba(255,255,255,0.8)' },
  name: { fontFamily: fonts.bold, fontSize: 20, color: colors.white, marginTop: 2 },
  avatar: { width: 48, height: 48, borderRadius: 24, borderWidth: 2, borderColor: 'rgba(255,255,255,0.6)' },
  scroll: { flex: 1, backgroundColor: '#F3F7FA', borderTopLeftRadius: 24, borderTopRightRadius: 24, marginTop: -20, overflow: 'hidden' },
  sheet: { padding: 16, paddingBottom: 32, gap: 16 },
  actions: { flexDirection: 'row', justifyContent: 'space-between' },
  action: { width: 72, alignItems: 'center', gap: 8 },
  tile: { width: 56, height: 56, borderRadius: 18, backgroundColor: '#E4F1F8', alignItems: 'center', justifyContent: 'center' },
  actionLabel: { fontFamily: fonts.medium, fontSize: 11, color: colors.ink, textAlign: 'center' },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  section: { fontFamily: fonts.bold, fontSize: 17, color: colors.ink },
  seeAll: { fontFamily: fonts.semiBold, fontSize: 13, color: colors.primary },
  txCard: { backgroundColor: '#FFFFFF', borderRadius: 18, paddingHorizontal: 16, borderWidth: 1, borderColor: '#E4EEF3' },
  sectionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  quickRow: { flexDirection: 'row', gap: 8 },
  quickCard: { flex: 1, backgroundColor: colors.white, borderRadius: 18, padding: 16, borderWidth: 1, borderColor: '#E4EEF3', alignItems: 'flex-start', gap: 8 },
  quickTile: { width: 44, height: 44, borderRadius: 14, backgroundColor: '#E4F1F8', alignItems: 'center', justifyContent: 'center' },
  notifDot: { position: 'absolute', top: 6, right: 6, width: 8, height: 8, borderRadius: 4, backgroundColor: '#EF4444', borderWidth: 1.5, borderColor: '#FFFFFF' },
  quickLabel: { fontFamily: fonts.semiBold, fontSize: 12, color: colors.ink },
  panelText: { fontFamily: fonts.regular, fontSize: 14, color: colors.muted },
  panelBtn: { height: 52, borderRadius: 26, backgroundColor: '#006199', alignItems: 'center', justifyContent: 'center', marginTop: 8 },
  panelBtnText: { fontFamily: fonts.semiBold, fontSize: 15, color: '#FFFFFF' },
});
