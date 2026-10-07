import { useCallback, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useRouter } from 'expo-router';
import { formatPeso, getBalance, getDbDiagnostics, initDatabase } from '../services/db';

const BLUE = '#0A84FF';

export default function HomeScreen() {
  const router = useRouter();
  const [balance, setBalance] = useState(0);
  const [diag, setDiag] = useState('');

  // Reload from SQLite every time the screen gains focus (e.g. back from Send).
  useFocusEffect(
    useCallback(() => {
      const { seeded } = initDatabase();
      setBalance(getBalance());
      getDbDiagnostics().then((d) => {
        const when = d.modificationTime ? new Date(d.modificationTime * 1000).toLocaleTimeString('en-PH') : 'n/a';
        setDiag(`DB: ${d.rows} rows · file ${d.exists ? `${d.size} bytes` : 'MISSING'} · modified ${when} · ${seeded ? 'fresh seed this launch' : 'existing data'}`);
      });
    }, []),
  );

  return (
    <View style={s.safe}>
      <SafeAreaView style={s.safe} edges={['top']}>
        <View style={s.body}>
          <Text style={s.eyebrow}>Maharlika · Offline Wallet</Text>
          <Text style={s.label}>Available Balance</Text>
          <Text style={s.balance}>{formatPeso(balance)}</Text>
          <Pressable
            style={s.primary}
            onPress={() => router.push('/lab/send')}
            accessibilityRole="button"
            accessibilityLabel="Send money"
          >
            <Text style={s.primaryText}>Send Money</Text>
          </Pressable>
          <Pressable
            style={s.secondary}
            onPress={() => router.push('/lab/history')}
            accessibilityRole="button"
            accessibilityLabel="Transaction history"
          >
            <Text style={s.secondaryText}>Transaction History</Text>
          </Pressable>
          <Text style={s.hint}>Stored in SQLite on-device · works in Airplane Mode</Text>
          {!!diag && <Text style={s.diag}>{diag}</Text>}
        </View>
      </SafeAreaView>
    </View>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFFFFF' },
  body: { flex: 1, padding: 24, justifyContent: 'center', gap: 12 },
  eyebrow: { fontSize: 12, fontWeight: '700', letterSpacing: 1, color: BLUE, textTransform: 'uppercase' },
  label: { fontSize: 14, color: '#64748B', marginTop: 8 },
  balance: { fontSize: 48, fontWeight: '800', color: '#0F172A' },
  primary: { minHeight: 56, borderRadius: 16, backgroundColor: BLUE, alignItems: 'center', justifyContent: 'center', marginTop: 16 },
  primaryText: { fontSize: 16, fontWeight: '700', color: '#FFFFFF' },
  secondary: { minHeight: 56, borderRadius: 16, borderWidth: 1.5, borderColor: BLUE, alignItems: 'center', justifyContent: 'center' },
  secondaryText: { fontSize: 16, fontWeight: '700', color: BLUE },
  hint: { fontSize: 12, color: '#64748B', textAlign: 'center', marginTop: 8 },
  diag: { fontSize: 11, color: '#64748B', textAlign: 'center', fontFamily: 'monospace' },
});
