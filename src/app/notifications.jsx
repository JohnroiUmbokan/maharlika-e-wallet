import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IOSStatusBar } from '../components/IOSStatusBar';
import { ModalSheet, ScreenHeader, SearchBar } from '../components/ui';
import { SwipeableNotifRow } from '../components/SwipeableNotifRow';
import { useStore } from '../store';
import { colors, fonts } from '../theme';

export default function Notifications() {
  const { notifications, markNotificationRead, readAllNotifications, deleteNotification, clearAllNotifications } = useStore();
  const [open, setOpen] = useState(null);
  const [search, setSearch] = useState('');

  const items = notifications ?? [];
  const filtered = items.filter((n) =>
    `${n.title} ${n.body}`.toLowerCase().includes(search.trim().toLowerCase()),
  );

  const openItem = (id) => {
    const item = items.find((x) => x.id === id);
    if (!item) return;
    markNotificationRead(id);
    setOpen(item);
  };

  const deleteItem = (id) => {
    const item = items.find((x) => x.id === id);
    if (!item) return;
    Alert.alert('Delete Notification', `Delete "${item.title}"? This cannot be undone.`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteNotification(id) },
    ]);
  };

  return (
    <View style={styles.safe}>
      <SafeAreaView style={{ backgroundColor: '#006199' }} edges={[]}>
        <IOSStatusBar light />
        <ScreenHeader title="Notifications" />
      </SafeAreaView>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.sheet} showsVerticalScrollIndicator={false}>
        <SearchBar value={search} onChangeText={setSearch} placeholder="Search notifications..." />
        <View style={styles.readAllRow}>
          <Text style={styles.countLabel}>
            {items.length} notification{items.length === 1 ? '' : 's'}
          </Text>
          <View style={styles.btnRow}>
            <Text
              style={[styles.readAllBtn, items.every((x) => !x.unread) && styles.readAllDisabled]}
              onPress={readAllNotifications}
              suppressHighlighting
              accessibilityRole="button"
              accessibilityLabel="Mark all as read"
            >
              Mark all read
            </Text>
            {items.length > 0 && (
              <Pressable
                style={styles.clearAllBtn}
                onPress={() =>
                  Alert.alert('Clear All', 'Delete all notifications? This cannot be undone.', [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Clear All', style: 'destructive', onPress: clearAllNotifications },
                  ])
                }
                accessibilityRole="button"
                accessibilityLabel="Clear all notifications"
              >
                <Text style={styles.clearAllText}>Clear all</Text>
              </Pressable>
            )}
          </View>
        </View>
        {filtered.length === 0 && (
          <View style={styles.card}>
            <Feather name="bell" size={20} color="#64748B" />
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>{items.length === 0 ? 'All caught up' : 'No matches'}</Text>
              <Text style={styles.body}>
                {items.length === 0 ? 'Transfers, cash ins, bills and promos will appear here.' : 'Try a different search term.'}
              </Text>
            </View>
          </View>
        )}
        {filtered.map((n) => (
          <SwipeableNotifRow
            key={n.id}
            id={n.id}
            title={n.title}
            body={n.body}
            when={n.when}
            icon={n.icon}
            unread={n.unread}
            onPress={openItem}
            onDelete={deleteItem}
          />
        ))}
        <Text style={styles.hint}>Swipe left to delete · tap to read</Text>
      </ScrollView>
      <ModalSheet visible={!!open} onClose={() => setOpen(null)} title={open?.title}>
        <Text style={styles.detailBody}>{open?.detail}</Text>
      </ModalSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#006199' },
  scroll: { flex: 1, backgroundColor: '#F3F7FA', borderTopLeftRadius: 24, borderTopRightRadius: 24, marginTop: -20, overflow: 'hidden' },
  sheet: { padding: 16, gap: 12, paddingBottom: 32 },
  readAllRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  countLabel: { fontFamily: fonts.regular, fontSize: 12, color: colors.muted },
  readAllBtn: { fontFamily: fonts.semiBold, fontSize: 13, color: '#006199' },
  readAllDisabled: { color: '#94A3B8' },
  card: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.white, borderRadius: 18, padding: 16, borderWidth: 1, borderColor: '#E4EEF3' },
  title: { fontFamily: fonts.semiBold, fontSize: 14, color: colors.ink },
  body: { fontFamily: fonts.regular, fontSize: 13, color: colors.muted, marginTop: 2 },
  hint: { fontFamily: fonts.regular, fontSize: 12, color: colors.muted, textAlign: 'center' },
  detailBody: { fontFamily: fonts.regular, fontSize: 14, color: colors.ink, lineHeight: 20 },
  btnRow: { flexDirection: 'row', gap: 8 },
  clearAllBtn: { backgroundColor: '#FEE2E2', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6 },
  clearAllText: { fontFamily: fonts.semiBold, fontSize: 13, color: '#EF4444' },
});