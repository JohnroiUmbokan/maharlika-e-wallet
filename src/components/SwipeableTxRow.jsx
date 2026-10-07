import { Pressable, StyleSheet, Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler'; // re-export guard
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import * as Haptics from 'expo-haptics';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { TxRow } from './ui';
import { colors } from '../theme';

export function SwipeableTxRow({ id, title, sub, amount, icon, last = false }) {
  const renderRightActions = () => (
    <Pressable
      style={s.deleteBtn}
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
        router.push({ pathname: '/modals/delete-transaction', params: { id, title, sub, amount: String(amount) } });
      }}
      accessibilityRole="button"
      accessibilityLabel={`Delete ${title}`}
    >
      <Feather name="trash-2" size={18} color="#FFFFFF" />
      <Text style={s.deleteText}>DELETE</Text>
    </Pressable>
  );

  return (
    <ReanimatedSwipeable renderRightActions={renderRightActions} overshootRight={false}>
      <View style={s.rowWrap}>
        <Pressable onPress={() => router.push({ pathname: '/transaction-detail', params: { id } })} accessibilityRole="button" accessibilityLabel={`Open ${title} details`}>
          <TxRow title={title} sub={sub} amount={amount} icon={icon} last={last} />
        </Pressable>
      </View>
    </ReanimatedSwipeable>
  );
}

// Keep tree-shaking happy when gesture-handler is unavailable (Expo Go web).
export function GestureRoot({ children }) {
  return <GestureHandlerRootView style={{ flex: 1 }}>{children}</GestureHandlerRootView>;
}

const s = StyleSheet.create({
  rowWrap: { backgroundColor: colors.white },
  deleteBtn: {
    width: 96,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    borderTopRightRadius: 18,
    borderBottomRightRadius: 18,
    marginVertical: 1,
    minHeight: 44,
  },
  deleteText: { color: '#FFFFFF', fontSize: 11, fontWeight: '700', letterSpacing: 0.5 },
});
