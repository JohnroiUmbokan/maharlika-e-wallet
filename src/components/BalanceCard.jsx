import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { colors, fonts } from '../theme';
import { formatPeso, useStore } from '../store';

export function BalanceCard() {
  const { balance, hidden, setHidden } = useStore();
  return (
    <LinearGradient colors={['#006199', '#00456E']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.card}>
      <View style={styles.leaf1} />
      <View style={styles.leaf2} />
      <View style={styles.row}>
        <Text style={styles.label}>Maharlika Wallet</Text>
        <Pressable onPress={() => router.push('/(tabs)/wallet')} hitSlop={8} accessibilityRole="button" accessibilityLabel="Go to my wallet">
          <Feather name="chevron-right" size={22} color="rgba(255,255,255,0.9)" />
        </Pressable>
      </View>
      <View style={styles.amountRow}>
        <Text style={styles.amount}>{hidden ? '₱ ••••••' : formatPeso(balance)}</Text>
        <Pressable onPress={() => setHidden(!hidden)} hitSlop={8} accessibilityRole="button" accessibilityLabel="Toggle balance visibility">
          <Feather name={hidden ? 'eye-off' : 'eye'} size={20} color="rgba(255,255,255,0.9)" />
        </Pressable>
      </View>
      <Text style={styles.sub}>Available balance</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: { minHeight: 136, borderRadius: 20, padding: 16, justifyContent: 'center', gap: 4, overflow: 'hidden' },
  leaf1: { position: 'absolute', right: -40, top: -40, width: 160, height: 160, borderRadius: 80, backgroundColor: 'rgba(255,255,255,0.08)' },
  leaf2: { position: 'absolute', right: 24, top: -64, width: 160, height: 160, borderRadius: 80, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.12)' },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  label: { fontFamily: fonts.medium, fontSize: 14, color: 'rgba(255,255,255,0.95)' },
  amountRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  amount: { fontFamily: fonts.bold, fontSize: 32, color: colors.white },
  sub: { fontFamily: fonts.regular, fontSize: 12, color: 'rgba(255,255,255,0.75)' },
});
