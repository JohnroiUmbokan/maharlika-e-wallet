import { Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { colors, fonts } from '../theme';
import { formatSigned } from '../store';

// Shared primitives — one line-icon set (Feather), 8px grid, spec colors.
// Primary #006199 · Deep #00456E · Gold #FFC107 (QR ring / NEW / chip only)

export function ScreenHeader({ title, onBack, right = 'help-circle', onRight }) {
  return (
    <View style={s.header}>
      <Pressable onPress={onBack ?? (() => router.back())} hitSlop={8} accessibilityRole="button">
        <Feather name="arrow-left" size={24} color="#FFFFFF" />
      </Pressable>
      <Text style={s.title} numberOfLines={1}>{title}</Text>
      <Pressable onPress={onRight} hitSlop={8} accessibilityRole="button">
        <Feather name={right} size={22} color="#FFFFFF" />
      </Pressable>
    </View>
  );
}

export function Sheet({ children, style }) {
  return <View style={[s.sheet, style]}>{children}</View>;
}

export function Label({ children }) {
  return <Text style={s.label}>{children}</Text>;
}

export function Field({ children, style }) {
  return <View style={[s.field, style]}>{children}</View>;
}

export function SearchBar({ value, onChangeText, placeholder = 'Search Biller' }) {
  return (
    <View style={s.search}>
      <Feather name="search" size={20} color={colors.primary} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#64748B"
        style={s.searchInput}
      />
    </View>
  );
}

export function PrimaryButton({ label, onPress, style }) {
  return (
    <Pressable onPress={onPress} style={[s.primary, style]} accessibilityRole="button">
      <Text style={s.primaryText}>{label}</Text>
    </Pressable>
  );
}

export function DarkOutlineButton({ label, icon = 'maximize-2', onPress }) {
  return (
    <Pressable onPress={onPress} style={s.darkOutline} accessibilityRole="button">
      <Feather name={icon} size={18} color="#FFFFFF" />
      <Text style={s.darkOutlineText}>{label}</Text>
    </Pressable>
  );
}

export function QuickChips({ values = ['₱100', '₱500', '₱1,000', '₱2,000'], onPick }) {
  return (
    <View style={s.chips}>
      {values.map((c) => (
        <Pressable key={c} style={s.chip} onPress={() => onPick?.(c)} accessibilityRole="button">
          <Text style={s.chipText}>{c}</Text>
        </Pressable>
      ))}
    </View>
  );
}

export function BillerAvatar({ initial = 'M', color = '#E07B39', size = 46 }) {
  return (
    <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: color, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontFamily: fonts.bold, fontSize: size * 0.4, color: '#FFFFFF' }}>{initial}</Text>
    </View>
  );
}

export function TxRow({ title, sub, amount, icon = 'send', last = false }) {
  const neg = amount < 0;
  return (
    <View style={[s.txRow, last && { borderBottomWidth: 0 }]}>
      <View style={s.txIcon}>
        <Feather name={icon} size={20} color={colors.primary} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={s.txTitle}>{title}</Text>
        <Text style={s.txSub} numberOfLines={1}>{sub}</Text>
      </View>
      <Text style={[s.txAmt, { color: neg ? '#EF4444' : '#16A34A' }]}>{formatSigned(amount)}</Text>
    </View>
  );
}

// Functional bottom nav for stack screens (mirrors the tab bar).
export function BottomNav({ active = 'home' }) {
  const go = (route) => router.replace(route);
  const item = (key, icon, label, route) => (
    <Pressable key={key} onPress={() => go(route)} style={s.navItem} accessibilityRole="button">
      <Feather name={icon} size={24} color={active === key ? colors.primary : '#64748B'} />
      <Text style={[s.navLabel, { color: active === key ? colors.primary : '#64748B', fontFamily: active === key ? fonts.semiBold : fonts.medium }]}>
        {label}
      </Text>
    </Pressable>
  );
  return (
    <View style={s.navBar}>
      {item('home', 'home', 'Home', '/(tabs)')}
      {item('wallet', 'credit-card', 'Wallet', '/(tabs)/wallet')}
      <Pressable onPress={() => router.push('/scan')} style={s.navScan} accessibilityRole="button">
        <View style={s.navScanBtn}>
          <MaterialCommunityIcons name="qrcode-scan" size={26} color="#FFFFFF" />
        </View>
        <View style={s.navNew}>
          <Text style={s.navNewText}>NEW</Text>
        </View>
        <Text style={s.navScanLabel}>Scan & Pay</Text>
      </Pressable>
      {item('bills', 'file-text', 'Bill Pay', '/(tabs)/bills')}
      {item('profile', 'user', 'Profile', '/(tabs)/profile')}
    </View>
  );
}

export function ModalSheet({ visible, onClose, title, children, dark = false }) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={s.backdrop} onPress={onClose} />
      <View style={[s.modal, dark && { backgroundColor: '#00456E' }]}>
        <View style={[s.handle, dark && { backgroundColor: 'rgba(255,255,255,0.4)' }]} />
        {!!title && <Text style={[s.modalTitle, dark && { color: '#FFFFFF' }]}>{title}</Text>}
        {children}
      </View>
    </Modal>
  );
}

// Zigzag tear for the receipt card (teeth painted in the sheet color).
export function ZigZag({ color = '#F3F7FA', teeth = 16 }) {
  return (
    <View style={s.zzRow}>
      {Array.from({ length: teeth }).map((_, i) => (
        <View key={i} style={[s.zzTooth, { backgroundColor: color }]} />
      ))}
    </View>
  );
}

const s = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: 16, paddingHorizontal: 24, paddingTop: 8, paddingBottom: 32, backgroundColor: '#006199' },
  title: { fontFamily: fonts.bold, fontSize: 20, color: '#FFFFFF', flex: 1 },
  sheet: { flex: 1, padding: 16, gap: 16, backgroundColor: '#F3F7FA', borderTopLeftRadius: 24, borderTopRightRadius: 24, marginTop: -20 },
  label: { fontFamily: fonts.bold, fontSize: 14, color: '#0F172A' },
  field: { minHeight: 56, paddingHorizontal: 16, paddingVertical: 8, flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#E4EEF3', borderRadius: 16 },
  search: { height: 56, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#E4EEF3', borderRadius: 28 },
  searchInput: { flex: 1, fontFamily: fonts.regular, fontSize: 14, color: '#0F172A' },
  primary: { height: 56, borderRadius: 28, backgroundColor: '#006199', alignItems: 'center', justifyContent: 'center' },
  primaryText: { fontFamily: fonts.semiBold, fontSize: 16, color: '#FFFFFF' },
  darkOutline: { height: 56, borderRadius: 28, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.7)', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  darkOutlineText: { fontFamily: fonts.semiBold, fontSize: 15, color: '#FFFFFF' },
  chips: { flexDirection: 'row', gap: 8 },
  chip: { flex: 1, height: 40, borderRadius: 20, backgroundColor: '#CFE4F0', alignItems: 'center', justifyContent: 'center' },
  chipText: { fontFamily: fonts.semiBold, fontSize: 12, color: '#006199' },
  txRow: { flexDirection: 'row', alignItems: 'center', gap: 16, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#E4EEF3' },
  txIcon: { width: 48, height: 48, borderRadius: 16, backgroundColor: '#E4F1F8', alignItems: 'center', justifyContent: 'center' },
  txTitle: { fontFamily: fonts.semiBold, fontSize: 14, color: '#0F172A' },
  txSub: { fontFamily: fonts.regular, fontSize: 11, color: '#64748B', marginTop: 2 },
  txAmt: { fontFamily: fonts.semiBold, fontSize: 13 },
  navBar: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'flex-end', backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: '#E4EEF3', paddingTop: 8, paddingBottom: 24, paddingHorizontal: 8 },
  navItem: { width: 64, alignItems: 'center', gap: 4 },
  navLabel: { fontSize: 11 },
  navScan: { width: 80, alignItems: 'center', marginTop: -32 },
  navScanBtn: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#006199', alignItems: 'center', justifyContent: 'center', borderWidth: 3.5, borderColor: '#FFC107' },
  navNew: { backgroundColor: '#FFC107', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 2, marginTop: -8, borderWidth: 2, borderColor: '#FFFFFF' },
  navNewText: { fontFamily: fonts.bold, fontSize: 9, color: '#00456E' },
  navScanLabel: { fontSize: 11, fontFamily: fonts.medium, color: '#64748B', marginTop: 2 },
  backdrop: { flex: 1, backgroundColor: 'rgba(15,23,42,0.5)' },
  modal: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, gap: 16, paddingBottom: 40 },
  handle: { width: 56, height: 5, borderRadius: 3, backgroundColor: '#E4EEF3', alignSelf: 'center' },
  modalTitle: { fontFamily: fonts.bold, fontSize: 18, color: '#0F172A', textAlign: 'center' },
  zzRow: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 8, marginTop: -23, marginBottom: -8 },
  zzTooth: { width: 14, height: 14, transform: [{ rotate: '45deg' }], borderRadius: 2 },
});
