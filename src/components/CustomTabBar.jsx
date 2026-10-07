import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { colors, fonts } from '../theme';

function TabItem({ icon, label, active, onPress }) {
  return (
    <Pressable onPress={onPress} style={styles.item} accessibilityRole="button">
      <Feather name={icon} size={24} color={active ? colors.primary : '#64748B'} />
      <Text style={[styles.label, { color: active ? colors.primary : '#64748B', fontFamily: active ? fonts.semiBold : fonts.medium }]}>{label}</Text>
    </Pressable>
  );
}

export function CustomTabBar({ state, navigation }) {
  const insets = useSafeAreaInsets();
  const current = state.routes[state.index]?.name;
  const go = (name) => navigation.navigate(name);
  return (
    <View style={[styles.bar, { paddingBottom: 14 + insets.bottom }]}>
      <TabItem icon="home" label="Home" active={current === 'index'} onPress={() => go('index')} />
      <TabItem icon="credit-card" label="Wallet" active={current === 'wallet'} onPress={() => go('wallet')} />
      <Pressable onPress={() => router.push('/scan')} style={styles.scanWrap} accessibilityRole="button">
        <View style={styles.scanBtn}>
          <MaterialCommunityIcons name="qrcode-scan" size={26} color="#FFF" />
        </View>
        <Text style={styles.scanLabel}>Scan & Pay</Text>
      </Pressable>
      <TabItem icon="file-text" label="Bill Pay" active={current === 'bills'} onPress={() => go('bills')} />
      <TabItem icon="user" label="Profile" active={current === 'profile'} onPress={() => go('profile')} />
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 10,
    paddingHorizontal: 8,
  },
  item: { width: 64, alignItems: 'center', gap: 4 },
  label: { fontSize: 11 },
  scanWrap: { width: 76, alignItems: 'center', marginTop: -32 },
  scanBtn: {
    width: 62, height: 62, borderRadius: 31,
    backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center',
    borderWidth: 3.5, borderColor: colors.gold,
  },
  scanLabel: { fontSize: 11, fontFamily: fonts.medium, color: '#64748B', marginTop: 2 },
});
