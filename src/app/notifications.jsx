import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IOSStatusBar } from '../components/IOSStatusBar';
import { ModalSheet, ScreenHeader, SearchBar } from '../components/ui';
import { SwipeableNotifRow } from '../components/SwipeableNotifRow';
import { colors, fonts } from '../theme';

const ITEMS = [
  { id: 'nb1', icon: 'zap', title: 'Bill reminder', body: 'Meralco bill of ₱1,298.00 is due Oct 15.', when: '2h ago', unread: true, detail: 'Pay early from the Pay Bills tab to keep your account in good standing. You can add your own bill there, too.' },
  { id: 'nb2', icon: 'arrow-down-left', title: 'Cash in received', body: '₱500.00 was added via Partner Store.', when: 'Yesterday', unread: true, detail: 'Your Maharlika balance was updated. Find it under Wallet Management.' },
  { id: 'nb3', icon: 'send', title: 'Transfer sent', body: '₱500.00 to Maria Santos.', when: 'Oct 04', unread: false, detail: 'This transfer was completed and recorded in your recent activity.' },
  { id: 'nb4', icon: 'gift', title: 'Promo available', body: '₱50 cashback on your next bill.', when: 'Oct 02', unread: false, detail: 'Cashback is applied automatically at Pay Bills. Demo offer only.' },
];

export default function Notifications() {
  const [items, setItems] = useState(ITEMS);
  const [open, setOpen] = useState(null);
  const [search, setSearch] = useState('');

  const filtered = items.filter((n) =>
    `${n.title} ${n.body}`.toLowerCase().includes(search.trim().toLowerCase()),
  );

  const openItem = (id) => {
    const item = items.find((x) => x.id === id);
    if (!item) return;
    setItems((prev) => prev.map((x) => (x.id === id ? { ...x, unread: false } : x)));
    setOpen(item);
  };

  const deleteItem = (id) => {
    const item = items.find((x) => x.id === id);
    if (!item) return;
    Alert.alert('Delete Notification', `Delete "${item.title}"? This cannot be undone.`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => setItems((prev) => prev.filter((x) => x.id !== id)) },
    ]);
  };

  const readAll = () => setItems((prev) => prev.map((x) => ({ ...x, unread: false })));

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
          <Text
            style={[styles.readAllBtn, items.every((x) => !x.unread) && styles.readAllDisabled]}
            onPress={readAll}
            suppressHighlighting
            accessibilityRole="button"
            accessibilityLabel="Mark all as read"
          >
            Mark all read
          </Text>
        </View>
        {filtered.length === 0 && (
          <View style={styles.card}>
            <Feather name="bell" size={20} color="#64748B" />
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>{items.length === 0 ? 'All caught up' : 'No matches'}</Text>
              <Text style={styles.body}>
                {items.length === 0 ? 'No notifications right now.' : 'Try a different search term.'}
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
});