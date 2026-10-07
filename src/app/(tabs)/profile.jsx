import { Alert, Image, Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { useState } from 'react';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { IOSStatusBar } from '../../components/IOSStatusBar';
import { MMark } from '../../components/MLogo';
import { ModalSheet } from '../../components/ui';
import { colors, fonts } from '../../theme';
import { LIMITS, useStore } from '../../store';

const MENU = [
  { key: 'account', label: 'My Account', icon: 'credit-card' },
  { key: 'personal', label: 'Personal Info', icon: 'user' },
  { key: 'security', label: 'Security / Device Management', icon: 'shield' },
  { key: 'limits', label: 'Limits', icon: 'pie-chart' },
  { key: 'notifications', label: 'Notifications / Push', icon: 'bell' },
  { key: 'about', label: 'About Maharlika', icon: 'info' },
  { key: 'logout', label: 'Logout', icon: 'log-out', danger: true },
];

function LimitBar({ used, max }) {
  return (
    <View style={p.track}>
      <View style={[p.fill, { width: `${Math.min(100, (used / max) * 100)}%` }]} />
    </View>
  );
}

export default function Profile() {
  const { user, pushEnabled, setPushEnabled, resetDemoData, security, setSecurityFlag } = useStore();
  const [sheet, setSheet] = useState(null);

  const press = (key) => {
    if (key === 'logout') return router.push('/modals/logout');
    if (key === 'account') return router.push('/account');
    setSheet(key);
  };

  const peso = (n) => `₱${n.toLocaleString('en-PH', { minimumFractionDigits: 2 })}`;

  return (
    <View style={p.safe}>
      <SafeAreaView style={{ backgroundColor: '#006199' }} edges={[]}>
        <IOSStatusBar light />
        <View style={p.header}>
          <View style={p.brand}>
            <MMark size={30} />
            <Text style={p.brandName}>Maharlika</Text>
          </View>
          <Pressable onPress={() => setSheet('notifications')} hitSlop={8}>
            <Feather name="settings" size={24} color="#FFFFFF" />
          </Pressable>
        </View>
      </SafeAreaView>
      <ScrollView style={p.scroll} contentContainerStyle={p.sheet} showsVerticalScrollIndicator={false}>
        <View style={p.identity}>
          <Image source={require('../../../assets/profile-photo.png')} style={p.photo} />
          <Text style={p.name}>{user.name}</Text>
          <Text style={p.phone}>{user.phone}</Text>
          <View style={p.badge}>
            <Feather name="check-circle" size={14} color="#16A34A" />
            <Text style={p.badgeText}>Verified</Text>
          </View>
        </View>
        <View style={p.menu}>
          {MENU.map((m, i) => (
            <Pressable key={m.key} style={[p.item, i < MENU.length - 1 && p.divider]} onPress={() => press(m.key)}>
              <View style={[p.iconTile, m.danger && { backgroundColor: '#FDECEC' }]}>
                {m.key === 'limits'
                  ? <MaterialCommunityIcons name="gauge" size={18} color={colors.primary} />
                  : m.key === 'personal'
                    ? <MaterialCommunityIcons name="account-outline" size={18} color={colors.primary} />
                    : <Feather name={m.icon} size={18} color={m.danger ? '#EF4444' : colors.primary} />}
              </View>
              <Text style={[p.itemLabel, m.danger && { color: '#EF4444' }]}>{m.label}</Text>
              {m.key === 'notifications' && !pushEnabled && <View style={p.offDot} />}
              <Feather name="chevron-right" size={18} color="#64748B" />
            </Pressable>
          ))}
        </View>
      </ScrollView>

      <ModalSheet visible={sheet === 'personal'} onClose={() => setSheet(null)} title="Personal Info">
        <Row k="Full name" v={user.name} />
        <Row k="Mobile" v={user.phone} />
        <Row k="Email" v={user.email} />
        <Row k="Account ID" v={user.id} />
        <Row k="Status" v="Verified" />
        <Pressable style={p.boardBtn} onPress={() => { setSheet(null); router.push('/account'); }} accessibilityRole="button" accessibilityLabel="Edit personal info">
          <Text style={p.boardText}>Edit in Account Interface</Text>
        </Pressable>
      </ModalSheet>

      <ModalSheet visible={sheet === 'security'} onClose={() => setSheet(null)} title="Security / Device Management">
        <View style={p.pushRow}>
          <View style={{ flex: 1 }}>
            <Text style={p.rowK}>Biometric login</Text>
            <Text style={p.rowSub}>Fingerprint / Face ID on app open</Text>
          </View>
          <Switch value={!!security?.biometric} onValueChange={(v) => setSecurityFlag('biometric', v)} trackColor={{ true: colors.primary }} />
        </View>
        <View style={p.pushRow}>
          <View style={{ flex: 1 }}>
            <Text style={p.rowK}>2-Step Verification</Text>
            <Text style={p.rowSub}>SMS code to ••• {user.phone.replace(/[^0-9]/g, '').slice(-4)}</Text>
          </View>
          <Switch value={!!security?.twoStep} onValueChange={(v) => setSecurityFlag('twoStep', v)} trackColor={{ true: colors.primary }} />
        </View>
        <Row k="This device" v="Juan's Phone · Trusted" />
        <Row k="Last login" v="Oct 06, 2026 · 9:41 AM" />
      </ModalSheet>

      <ModalSheet visible={sheet === 'limits'} onClose={() => setSheet(null)} title="Limits">
        {LIMITS.map((l) => (
          <View key={l.label} style={{ gap: 8 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={p.rowK}>{l.label}</Text>
              <Text style={p.rowV}>{peso(l.used)} / {peso(l.max)}</Text>
            </View>
            <LimitBar used={l.used} max={l.max} />
            <Text style={p.rowSub}>Remaining: {peso(Math.max(0, l.max - l.used))}</Text>
          </View>
        ))}
        <Row k="Daily send cap" v="₱50,000.00" />
        <Row k="Bills payment cap" v="₱50,000.00" />
      </ModalSheet>

      <ModalSheet visible={sheet === 'notifications'} onClose={() => setSheet(null)} title="Notifications / Push">
        <View style={p.pushRow}>
          <View style={{ flex: 1 }}>
            <Text style={p.rowK}>Push notifications</Text>
            <Text style={p.rowSub}>Payments, bills and promos</Text>
          </View>
          <Switch value={pushEnabled} onValueChange={setPushEnabled} trackColor={{ true: colors.primary }} />
        </View>
      </ModalSheet>

      <ModalSheet visible={sheet === 'about'} onClose={() => setSheet(null)} title="About Maharlika">
        <Row k="App version" v="1.0.0 (SDK 57)" />
        <Row k="Status" v="Up to date" />
        <Row k="Platform" v="Expo React Native · Demo" />
        <Text style={p.rowSub}>Maharlika — Send, pay and save, all in one wallet. Made for the Philippines. No real money moves.</Text>
        <Pressable
          style={p.boardBtn}
          onPress={() => { setSheet(null); router.push('/lab'); }}
          accessibilityRole="button"
          accessibilityLabel="Open Lab 05 offline wallet"
        >
          <Text style={p.boardText}>Lab 05 · Offline Wallet (SQLite)</Text>
        </Pressable>
        <Pressable
          style={p.boardBtn}
          onPress={() => { resetDemoData(); setSheet(null); Alert.alert('Demo reset', 'Balance and transaction history restored.'); }}
          accessibilityRole="button"
          accessibilityLabel="Reset demo data"
        >
          <Text style={p.boardText}>Reset demo data</Text>
        </Pressable>
      </ModalSheet>
    </View>
  );
}

function Row({ k, v }) {
  return (
    <View style={p.kv}>
      <Text style={p.rowK}>{k}</Text>
      <Text style={p.rowV}>{v}</Text>
    </View>
  );
}

const p = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#006199' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingTop: 8, paddingBottom: 32, backgroundColor: '#006199' },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  brandName: { fontFamily: fonts.bold, fontSize: 20, color: colors.white },
  scroll: { flex: 1, backgroundColor: '#F3F7FA', borderTopLeftRadius: 24, borderTopRightRadius: 24, marginTop: -20, overflow: 'hidden' },
  sheet: { padding: 16, gap: 16, paddingBottom: 32 },
  identity: { alignItems: 'center' },
  photo: { width: 88, height: 88, borderRadius: 44 },
  name: { fontFamily: fonts.bold, fontSize: 22, color: colors.ink, marginTop: 16 },
  phone: { fontFamily: fonts.regular, fontSize: 13, color: colors.muted, marginTop: 4 },
  badge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 16, paddingVertical: 4, borderRadius: 14, backgroundColor: '#E6F7EB', marginTop: 8 },
  badgeText: { fontFamily: fonts.semiBold, fontSize: 12, color: '#16A34A' },
  menu: { backgroundColor: colors.white, borderRadius: 18, paddingHorizontal: 16, borderWidth: 1, borderColor: '#E4EEF3' },
  item: { flexDirection: 'row', alignItems: 'center', gap: 16, paddingVertical: 16 },
  divider: { borderBottomWidth: 1, borderBottomColor: '#E4EEF3' },
  iconTile: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#E4F1F8', alignItems: 'center', justifyContent: 'center' },
  itemLabel: { flex: 1, fontFamily: fonts.medium, fontSize: 14, color: colors.ink },
  offDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#EF4444' },
  kv: { flexDirection: 'row', justifyContent: 'space-between', gap: 16 },
  rowK: { fontFamily: fonts.regular, fontSize: 13, color: colors.muted },
  rowV: { fontFamily: fonts.semiBold, fontSize: 13, color: colors.ink, textAlign: 'right' },
  rowSub: { fontFamily: fonts.regular, fontSize: 13, color: colors.muted },
  pushRow: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  track: { height: 8, borderRadius: 4, backgroundColor: '#E4EEF3' },
  fill: { height: 8, borderRadius: 4, backgroundColor: colors.primary },
  boardBtn: { height: 56, borderRadius: 28, backgroundColor: '#CFE4F0', alignItems: 'center', justifyContent: 'center' },
  boardText: { fontFamily: fonts.semiBold, fontSize: 15, color: colors.primary },
});
