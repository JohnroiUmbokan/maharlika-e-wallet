import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { useState } from 'react';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { IOSStatusBar } from '../components/IOSStatusBar';
import { colors, fonts } from '../theme';

const DEEP = '#0B1B26';
const BTN = '#0B1B26';

export default function Scan() {
  const [torch, setTorch] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  const onBarcodeScanned = ({ data }) => {
    if (scanned) return;
    setScanned(true);
    try {
      // Spec QR payload: JSON { v:1, name, account, amount }
      const parsed = JSON.parse(data);
      const to = parsed.name || parsed.to || data;
      const amount = parsed.amount ? String(parsed.amount) : undefined;
      router.push({ pathname: '/send', params: amount ? { to, amount } : { to } });
    } catch {
      // Fallback: legacy maharlika:pay deep-link payloads
      const match = /to=([^&]+)/.exec(data);
      const amt = /amount=([\d.]+)/.exec(data);
      if (match) {
        router.push({ pathname: '/send', params: { to: decodeURIComponent(match[1]), ...(amt ? { amount: amt[1] } : {}) } });
      } else {
        Alert.alert('QR scanned', data.slice(0, 200));
        setScanned(false);
      }
    }
  };

  if (!permission) return <View style={styles.bg} />;
  if (!permission.granted) {
    return (
      <View style={styles.bg}>
        <SafeAreaView style={{ backgroundColor: DEEP }} edges={[]}>
          <IOSStatusBar light />
          <View style={styles.header}>
            <Pressable onPress={() => router.back()} hitSlop={8} accessibilityRole="button">
              <Feather name="arrow-left" size={24} color="#FFFFFF" />
            </Pressable>
            <Text style={styles.title}>Scan & Pay</Text>
            <View style={{ width: 24 }} />
          </View>
        </SafeAreaView>
        <View style={styles.fallback}>
          <Feather name="camera-off" size={40} color="rgba(255,255,255,0.7)" />
          <Text style={styles.h1}>Camera access is off</Text>
          <Text style={styles.sub}>Allow camera access to scan QR codes. You can still generate QR codes or enter details manually.</Text>
          <Pressable style={styles.filled} onPress={requestPermission} accessibilityRole="button" accessibilityLabel="Allow camera access">
            <Text style={styles.filledText}>Allow Camera</Text>
          </Pressable>
          <Pressable onPress={() => router.push('/generate-qr')} accessibilityRole="button">
            <Text style={styles.simText}>Generate QR instead</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.bg}>
      <SafeAreaView style={{ backgroundColor: DEEP }} edges={[]}>
        <IOSStatusBar light />
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} hitSlop={8} accessibilityRole="button">
            <Feather name="arrow-left" size={24} color="#FFFFFF" />
          </Pressable>
          <Text style={styles.title}>Scan & Pay</Text>
          <Pressable onPress={() => Alert.alert('Scan & Pay', 'Point your camera at any Maharlika or QR Ph code.')} hitSlop={8}>
            <MaterialCommunityIcons name="qrcode" size={22} color="#FFFFFF" />
          </Pressable>
        </View>
      </SafeAreaView>
      <View style={styles.body}>
        <Text style={styles.h1}>Place the QR code in the frame</Text>
        <Text style={styles.sub}>Maharlika / QR Ph codes auto-fill Send Money.</Text>
        <View style={styles.frame}>
          <CameraView
            style={StyleSheet.absoluteFill}
            facing="back"
            enableTorch={torch}
            barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
            onBarcodeScanned={onBarcodeScanned}
          />
          <View style={[styles.corner, { top: 0, left: 0, borderTopWidth: 4, borderLeftWidth: 4, borderTopLeftRadius: 16 }]} />
          <View style={[styles.corner, { top: 0, right: 0, borderTopWidth: 4, borderRightWidth: 4, borderTopRightRadius: 16 }]} />
          <View style={[styles.corner, { bottom: 0, left: 0, borderBottomWidth: 4, borderLeftWidth: 4, borderBottomLeftRadius: 16 }]} />
          <View style={[styles.corner, { bottom: 0, right: 0, borderBottomWidth: 4, borderRightWidth: 4, borderBottomRightRadius: 16 }]} />
          <View style={styles.scanLine} />
          <Pressable onPress={() => setTorch((v) => !v)} style={[styles.torch, torch && styles.torchOn]} hitSlop={8} accessibilityRole="button" accessibilityLabel="Toggle torch">
            <Feather name="zap" size={16} color={torch ? DEEP : '#FFFFFF'} />
          </Pressable>
        </View>
        <View style={styles.readyRow}>
          <Feather name="crosshair" size={16} color="#16A34A" />
          <Text style={styles.ready}>Ready to scan</Text>
        </View>
        <View style={{ gap: 16, marginTop: 24 }}>
          <Pressable style={styles.filled} onPress={() => router.push({ pathname: '/generate-qr', params: { mode: 'mine' } })} accessibilityRole="button">
            <MaterialCommunityIcons name="qrcode" size={18} color="#FFFFFF" />
            <Text style={styles.filledText}>Generate QR (Receive Payment)</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, backgroundColor: DEEP },
  header: { flexDirection: 'row', alignItems: 'center', gap: 16, paddingHorizontal: 24, paddingTop: 8, paddingBottom: 16 },
  title: { fontFamily: fonts.bold, fontSize: 20, color: colors.white, flex: 1 },
  body: { flex: 1, paddingHorizontal: 24, paddingBottom: 24, backgroundColor: '#0B1B26' },
  focusRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
  focus: { fontFamily: fonts.semiBold, fontSize: 11, letterSpacing: 1, color: 'rgba(255,255,255,0.7)' },
  h1: { fontFamily: fonts.bold, fontSize: 18, color: colors.white, textAlign: 'center', marginTop: 16 },
  sub: { fontFamily: fonts.regular, fontSize: 13, color: 'rgba(255,255,255,0.7)', textAlign: 'center', marginTop: 8 },
  hintText: { fontFamily: fonts.regular, fontSize: 12, color: '#FFC107', textAlign: 'center', marginTop: 8 },
  frame: { height: 336, marginTop: 24, alignItems: 'center', justifyContent: 'center', overflow: 'hidden', borderRadius: 16 },
  fallback: { flex: 1, paddingHorizontal: 24, paddingBottom: 24, backgroundColor: '#0B1B26', alignItems: 'center', justifyContent: 'center', gap: 16 },
  corner: { position: 'absolute', width: 56, height: 56, borderColor: colors.white },
  qrCard: { width: 184, height: 184, backgroundColor: colors.white, borderRadius: 16, padding: 16, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  qrGrid: { width: 160, height: 160, flexDirection: 'row', flexWrap: 'wrap' },
  cell: { width: 10, height: 10 },
  blur: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, borderRadius: 16 },
  scanLine: { position: 'absolute', width: 280, height: 2, backgroundColor: '#16A34A' },
  torch: { position: 'absolute', top: 8, right: 8, width: 36, height: 36, borderRadius: 18, borderWidth: 1, borderColor: 'rgba(255,255,255,0.5)', alignItems: 'center', justifyContent: 'center' },
  torchOn: { backgroundColor: '#FFC107', borderColor: '#FFC107' },
  live: { fontFamily: fonts.semiBold, fontSize: 11, letterSpacing: 1.5, color: 'rgba(255,255,255,0.85)', textAlign: 'center', marginTop: 16 },
  readyRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 24 },
  ready: { fontFamily: fonts.regular, fontSize: 12, color: 'rgba(255,255,255,0.8)' },
  filled: { height: 56, borderRadius: 28, backgroundColor: BTN, borderWidth: 1, borderColor: 'rgba(255,255,255,0.35)', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  filledText: { fontFamily: fonts.semiBold, fontSize: 15, color: '#FFFFFF' },
  simBtn: { alignItems: 'center', paddingVertical: 4 },
  simText: { fontFamily: fonts.regular, fontSize: 12, color: 'rgba(255,255,255,0.45)' },
});
