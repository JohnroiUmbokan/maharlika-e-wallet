import { useCallback, useState } from 'react';
import { Alert, FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useRouter } from 'expo-router';
import { deleteTransaction, formatPeso, getTransactions, initDatabase } from '../services/db';

const BLUE = '#0A84FF';

export default function HistoryScreen() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [rows, setRows] = useState([]);

  const load = useCallback((q = '') => {
    initDatabase();
    setRows(getTransactions(q));
  }, []);

  useFocusEffect(
    useCallback(() => {
      load('');
    }, [load]),
  );

  const confirmDelete = (id, name) => {
    Alert.alert('Delete Confirmation', `Remove "${name}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          deleteTransaction(id);
          load(search);
        },
      },
    ]);
  };

  const renderItem = ({ item }) => (
    <Pressable
      style={s.card}
      onLongPress={() => confirmDelete(item.id, item.recipient ?? item.type)}
      delayLongPress={400}
      accessibilityRole="button"
      accessibilityLabel={`Transaction ${item.id}, long press to delete`}
    >
      <View style={{ flex: 1 }}>
        <Text style={s.name}>
          {item.type} · {item.recipient || '—'}
        </Text>
        <Text style={s.meta}>
          {new Date(item.timestamp).toLocaleString('en-PH')}
        </Text>
      </View>
      <Text style={[s.amount, item.type === 'Send' && s.outgoing]}>{formatPeso(item.amount)}</Text>
    </Pressable>
  );

  return (
    <View style={s.safe}>
      <SafeAreaView style={s.safe} edges={['top']}>
        <View style={s.body}>
          <Pressable onPress={() => router.back()} accessibilityRole="button" accessibilityLabel="Go back">
            <Text style={s.back}>‹ Back</Text>
          </Pressable>
          <Text style={s.title}>Transaction History</Text>
          <TextInput
            style={s.search}
            placeholder="🔍 Search recipient or type (SQL LIKE)..."
            placeholderTextColor="#94A3B8"
            value={search}
            onChangeText={(t) => {
              setSearch(t);
              load(t);
            }}
          />
          <FlatList
            data={rows}
            keyExtractor={(item) => String(item.id)}
            renderItem={renderItem}
            contentContainerStyle={{ gap: 8, paddingBottom: 24 }}
            ListEmptyComponent={<Text style={s.empty}>No transactions in SQLite database.</Text>}
          />
          <Text style={s.hint}>Long-press a row to delete it.</Text>
        </View>
      </SafeAreaView>
    </View>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8FAFC' },
  body: { flex: 1, padding: 16 },
  back: { fontSize: 16, fontWeight: '600', color: BLUE, paddingVertical: 8 },
  title: { fontSize: 22, fontWeight: '800', color: '#0F172A', marginBottom: 12 },
  search: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 8, padding: 12, marginBottom: 12, fontSize: 14 },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#E2E8F0' },
  name: { fontSize: 15, fontWeight: '700', color: '#1E293B' },
  meta: { fontSize: 12, color: '#64748B', marginTop: 2 },
  amount: { fontSize: 15, fontWeight: '700', color: BLUE },
  outgoing: { color: '#DC2626' },
  empty: { textAlign: 'center', color: '#64748B', marginTop: 30 },
  hint: { fontSize: 12, color: '#64748B', textAlign: 'center', paddingVertical: 8 },
});
