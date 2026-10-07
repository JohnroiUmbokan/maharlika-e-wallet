import { Pressable, ScrollView, Share, StyleSheet, Text, TextInput, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import QRCode from 'react-native-qrcode-svg';
import { IOSStatusBar } from '../components/IOSStatusBar';
import { Label, PrimaryButton, QuickChips, ScreenHeader } from '../components/ui';
import { colors, fonts } from '../theme';
import { toCentavos } from '../utils/money';
import { useStore } from '../store';

export default function GenerateQR() {
  const params = useLocalSearchParams();
  const { user } = useStore();
  const [label, setLabel] = useState(`${user.name} · ${user.phone}`);
  const [amount, setAmount] = useState(0);
  const [msg, setMsg] = useState('');
  const isMine = params.mode === 'mine';
  const [view, setView] = useState('form'); // 'form' | 'qr'
  const account = user.phone.replace(/[^0-9]/g, '');
  const effectiveLabel = useMemo(() => (isMine ? `${user.name} · ${user.phone}` : label), [isMine, label, user.name, user.phone]);

  const pick = (chip) => setAmount(parseFloat(chip.replace(/[^0-9.]/g, '')) || 0);
  // Spec QR payload: JSON { v:1, name, account, amount }
  const payload = JSON.stringify({ v: 1, name: effectiveLabel, account, amount: toCentavos(amount) });

  const share = async () => {
    await Share.share({ message: `Maharlika QR — ${effectiveLabel} · ${payload}` });
  };

  return (
    <View style={styles.safe}>
      <SafeAreaView style={{ backgroundColor: '#006199' }} edges={[]}>
        <IOSStatusBar light />
        <ScreenHeader title="Generate QR" right="grid" onRight={() => setView((v) => (v === 'qr' ? 'form' : 'qr'))} />
      </SafeAreaView>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.sheet} showsVerticalScrollIndicator={false}>
        {view === 'qr' ? (
          <View style={styles.bigQrScreen}>
            <Text style={styles.bigQrTitle}>Scan to Receive Payment</Text>
            <View style={styles.bigQrCard}>
              <QRCode value={payload} size={280} color="#0F172A" backgroundColor="#FFFFFF" />
            </View>
            <Text style={styles.bigQrName}>{effectiveLabel}</Text>
            <Text style={styles.bigQrAmount}>{amount ? `₱${amount.toLocaleString('en-PH', { minimumFractionDigits: 2 })}` : 'Open amount'}</Text>
            <Text style={styles.caption}>This QR is large enough to scan from another phone.</Text>
            <View style={styles.bigQrActions}>
              <PrimaryButton label="Share QR" onPress={share} />
              <Pressable style={styles.editBack} onPress={() => setView('form')} accessibilityRole="button" accessibilityLabel="Back to edit">
                <Text style={styles.editBackText}>Back to edit</Text>
              </Pressable>
            </View>
          </View>
        ) : (
          <>
            {isMine ? (
              <View style={styles.mineCard}>
                <Feather name="user" size={18} color={colors.primary} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.mineName}>{user.name}</Text>
                  <Text style={styles.mineSub}>{user.phone} · receiving payments</Text>
                </View>
              </View>
            ) : (
              <>
                <Label>Recipient Name / Account Number</Label>
                <View style={styles.inputRow}>
                  <TextInput value={effectiveLabel} onChangeText={setLabel} style={styles.input} />
                </View>
              </>
            )}
            <Label>Amount</Label>
            <View style={styles.amountBox}>
              <TextInput
                value={amount ? `₱${amount.toLocaleString('en-PH', { minimumFractionDigits: 2 })}` : '₱0.00'}
                onChangeText={(t) => setAmount(parseFloat(t.replace(/[^0-9.]/g, '')) || 0)}
                keyboardType="numeric"
                style={styles.amount}
              />
            </View>
            <QuickChips onPick={pick} />
            <Label>Message (Optional)</Label>
            <View style={styles.msgBox}>
              <TextInput value={msg} onChangeText={setMsg} placeholder="Add a note to your payment" placeholderTextColor="#64748B" style={styles.input} />
            </View>
            <PrimaryButton label="Generate QR" onPress={() => setView('qr')} />
            <Pressable onPress={share} style={styles.shareRow} accessibilityRole="button" accessibilityLabel="Share QR code">
              <Text style={styles.shareText}>Share your QR to receive money instantly.</Text>
            </Pressable>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#006199' },
  scroll: { flex: 1, backgroundColor: '#F3F7FA', borderTopLeftRadius: 24, borderTopRightRadius: 24, marginTop: -20, overflow: 'hidden' },
  sheet: { padding: 16, gap: 16, paddingBottom: 24 },
  inputRow: { height: 56, paddingHorizontal: 16, backgroundColor: '#E4EEF3', borderRadius: 16, justifyContent: 'center' },
  input: { fontFamily: fonts.regular, fontSize: 14, color: colors.ink },
  amountBox: { minHeight: 88, backgroundColor: '#E4EEF3', borderRadius: 16, justifyContent: 'center', paddingVertical: 16, paddingHorizontal: 16 },
  amount: { fontFamily: fonts.bold, fontSize: 36, color: colors.ink, textAlign: 'left' },
  msgBox: { minHeight: 88, padding: 16, backgroundColor: '#E4EEF3', borderRadius: 16 },
  qrCard: { backgroundColor: '#FFFFFF', borderRadius: 20, borderWidth: 1, borderColor: '#E4EEF3', padding: 24, alignItems: 'center', gap: 8, alignSelf: 'stretch' },
  qrSection: { gap: 8 },
  qrLabel: { fontFamily: fonts.semiBold, fontSize: 13, color: colors.ink, marginTop: 8 },
  qrAmt: { fontFamily: fonts.bold, fontSize: 22, color: colors.primary },
  caption: { fontFamily: fonts.regular, fontSize: 12, color: colors.muted, textAlign: 'center' },
  bigQrScreen: { alignItems: 'center', gap: 12, paddingTop: 16, paddingBottom: 24 },
  bigQrTitle: { fontFamily: fonts.bold, fontSize: 20, color: colors.ink },
  bigQrCard: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 20, borderWidth: 1, borderColor: '#E4EEF3' },
  bigQrName: { fontFamily: fonts.semiBold, fontSize: 15, color: colors.ink },
  bigQrAmount: { fontFamily: fonts.bold, fontSize: 26, color: colors.primary },
  bigQrActions: { width: '100%', gap: 12, marginTop: 8 },
  editBack: { minHeight: 52, borderRadius: 26, backgroundColor: '#E4EEF3', alignItems: 'center', justifyContent: 'center' },
  editBackText: { fontFamily: fonts.semiBold, fontSize: 15, color: colors.ink },
  mineCard: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#E4F1F8', borderRadius: 16, padding: 16 },
  mineName: { fontFamily: fonts.semiBold, fontSize: 15, color: colors.ink },
  mineSub: { fontFamily: fonts.regular, fontSize: 12, color: colors.muted, marginTop: 2 },
  shareRow: { alignItems: 'center' },
  shareText: { fontFamily: fonts.regular, fontSize: 12, color: colors.muted, textAlign: 'center' },
});
