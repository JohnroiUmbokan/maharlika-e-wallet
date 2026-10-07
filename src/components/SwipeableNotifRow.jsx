import { Pressable, StyleSheet, Text, View } from 'react-native';
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import * as Haptics from 'expo-haptics';
import { Feather } from '@expo/vector-icons';

export function SwipeableNotifRow({ id, title, body, when, icon, unread, onPress, onDelete }) {
  const renderRightActions = () => (
    <Pressable
      style={s.deleteBtn}
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
        onDelete?.(id);
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
        <Pressable onPress={() => onPress?.(id)} accessibilityRole="button" accessibilityLabel={`Open ${title}`}>
          <View style={[s.card, unread && s.unread]}>
            <View style={s.tile}>
              <Feather name={icon} size={20} color="#006199" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.title}>{title}</Text>
              <Text style={s.body}>{body}</Text>
              <Text style={s.when}>{when}</Text>
            </View>
            {unread && <View style={s.dot} />}
          </View>
        </Pressable>
      </View>
    </ReanimatedSwipeable>
  );
}

const s = StyleSheet.create({
  rowWrap: { backgroundColor: '#FFFFFF' },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E4EEF3',
  },
  unread: { backgroundColor: '#E4F1F8' },
  tile: { width: 44, height: 44, borderRadius: 14, backgroundColor: '#E4F1F8', alignItems: 'center', justifyContent: 'center' },
  title: { fontFamily: 'Inter_600SemiBold', fontSize: 14, color: '#0F172A' },
  body: { fontFamily: 'Inter_400Regular', fontSize: 13, color: '#64748B', marginTop: 2 },
  when: { fontFamily: 'Inter_400Regular', fontSize: 11, color: '#64748B', marginTop: 6 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#006199' },
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