import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useState } from 'react';
import { TxRow } from '../../components/ui';
import { colors, fonts } from '../../theme';
import { useStore } from '../../store';

export default function DeleteTransactionModal() {
  const params = useLocalSearchParams();
  const { deleteTransaction } = useStore();
  const [toast, setToast] = useState(false);
  const id = typeof params.id === 'string' ? params.id : '';
  const title = typeof params.title === 'string' ? params.title : 'Transaction';
  const sub = typeof params.sub === 'string' ? params.sub : '';
  const amount = parseFloat(typeof params.amount === 'string' ? params.amount : '0') || 0;

  const confirm = async () => {
    deleteTransaction(id);
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    setToast(true);
    setTimeout(() => router.back(), 450);
  };

  return (
    <View style={s.overlay}>
      <View style={s.modal}>
        <Text style={s.title}>Delete Transaction</Text>
        <View style={s.row}>
          <TxRow title={title} sub={sub} amount={amount} icon="send" last />
        </View>
        <Text style={s.body}>Delete this transaction? This cannot be undone.</Text>
        {toast && <Text style={s.toast}>Deleted ✓</Text>}
        <Pressable style={s.confirm} onPress={confirm} accessibilityRole="button" accessibilityLabel="Confirm delete">
          <Text style={s.confirmText}>Confirm</Text>
        </Pressable>
        <Pressable style={s.cancel} onPress={() => router.back()} accessibilityRole="button" accessibilityLabel="Cancel delete">
          <Text style={s.cancelText}>Cancel</Text>
        </Pressable>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(15,23,42,0.5)', alignItems: 'center', justifyContent: 'center', padding: 24 },
  modal: { backgroundColor: colors.white, borderRadius: 20, padding: 24, gap: 16, width: '100%' },
  title: { fontFamily: fonts.bold, fontSize: 18, color: colors.ink, textAlign: 'center' },
  row: { backgroundColor: '#F3F7FA', borderRadius: 16, paddingHorizontal: 12, borderWidth: 1, borderColor: '#E4EEF3' },
  body: { fontFamily: fonts.regular, fontSize: 13, color: colors.muted, textAlign: 'center' },
  toast: { fontFamily: fonts.semiBold, fontSize: 13, color: '#16A34A', textAlign: 'center' },
  confirm: { minHeight: 52, borderRadius: 26, backgroundColor: '#006199', alignItems: 'center', justifyContent: 'center' },
  confirmText: { fontFamily: fonts.semiBold, fontSize: 16, color: '#FFFFFF' },
  cancel: { minHeight: 52, borderRadius: 26, backgroundColor: '#E4EEF3', alignItems: 'center', justifyContent: 'center' },
  cancelText: { fontFamily: fonts.semiBold, fontSize: 15, color: colors.ink },
});
