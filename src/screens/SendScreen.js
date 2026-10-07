import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { createSendTransaction, formatPeso } from '../services/db';

const BLUE = '#0A84FF';

export default function SendScreen() {
  const router = useRouter();
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [error, setError] = useState('');

  const submit = () => {
    try {
      const remaining = createSendTransaction({ recipient, amount: parseFloat(amount), note });
      setError('');
      Alert.alert('Sent', `New balance: ${formatPeso(remaining)}`, [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <View style={s.safe}>
      <SafeAreaView style={s.safe} edges={['top']}>
        <View style={s.body}>
          <Pressable onPress={() => router.back()} accessibilityRole="button" accessibilityLabel="Go back">
            <Text style={s.back}>‹ Back</Text>
          </Pressable>
          <Text style={s.title}>Send Money</Text>
          <Text style={s.label}>Recipient</Text>
          <TextInput value={recipient} onChangeText={setRecipient} placeholder="Name" placeholderTextColor="#94A3B8" style={s.input} />
          <Text style={s.label}>Amount (₱)</Text>
          <TextInput
            value={amount}
            onChangeText={setAmount}
            placeholder="0.00"
            placeholderTextColor="#94A3B8"
            keyboardType="numeric"
            style={s.input}
          />
          <Text style={s.label}>Note (optional)</Text>
          <TextInput value={note} onChangeText={setNote} placeholder="What's it for?" placeholderTextColor="#94A3B8" style={s.input} />
          {!!error && (
            <Text style={s.error} accessibilityRole="alert">
              {error}
            </Text>
          )}
          <Pressable style={s.primary} onPress={submit} accessibilityRole="button" accessibilityLabel="Send">
            <Text style={s.primaryText}>Send</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFFFFF' },
  body: { flex: 1, padding: 24, gap: 8 },
  back: { fontSize: 16, fontWeight: '600', color: BLUE, paddingVertical: 8 },
  title: { fontSize: 28, fontWeight: '800', color: '#0F172A', marginBottom: 8 },
  label: { fontSize: 13, fontWeight: '600', color: '#0F172A', marginTop: 8 },
  input: { minHeight: 52, borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 12, paddingHorizontal: 14, fontSize: 16, color: '#0F172A' },
  error: { fontSize: 13, fontWeight: '600', color: '#EF4444', marginTop: 4 },
  primary: { minHeight: 56, borderRadius: 16, backgroundColor: BLUE, alignItems: 'center', justifyContent: 'center', marginTop: 16 },
  primaryText: { fontSize: 16, fontWeight: '700', color: '#FFFFFF' },
});
