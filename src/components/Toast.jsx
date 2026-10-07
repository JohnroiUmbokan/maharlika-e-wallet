import { useEffect, useRef } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useStore } from '../store';

export function Toast() {
  const { toast, clearToast } = useStore();
  const clearRef = useRef(clearToast);
  useEffect(() => {
    clearRef.current = clearToast;
  }, [clearToast]);

  // One timer per new toast message; not reset by unrelated store re-renders.
  useEffect(() => {
    if (!toast) return undefined;
    const t = setTimeout(() => clearRef.current(), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  if (!toast) return null;
  return (
    <View pointerEvents="box-none" style={s.wrap}>
      <Pressable style={s.card} onPress={() => clearRef.current()} accessibilityRole="alert" accessibilityLabel={toast}>
        <View style={s.dot} />
        <View style={{ flex: 1 }}>
          <Text style={s.title}>Maharlika</Text>
          <Text style={s.body}>{toast}</Text>
        </View>
        <Feather name="x" size={18} color="#64748B" />
      </Pressable>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { position: 'absolute', top: 12, left: 16, right: 16, alignItems: 'center', zIndex: 100 },
  card: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E4EEF3',
    paddingHorizontal: 16,
    paddingVertical: 14,
    shadowColor: '#006199',
    shadowOpacity: 0.18,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
  },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#16A34A' },
  title: { fontFamily: 'Inter_700Bold', fontSize: 12, color: '#006199' },
  body: { fontFamily: 'Inter_400Regular', fontSize: 13, color: '#0F172A', marginTop: 2 },
});
