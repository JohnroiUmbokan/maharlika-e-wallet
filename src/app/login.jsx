import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useState } from 'react';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';
import { IOSStatusBar } from '../components/IOSStatusBar';
import { MLogo } from '../components/MLogo';
import { colors, fonts } from '../theme';

const DEMO_EMAIL = 'juan@maharlika.app';
const DEMO_PASSWORD = 'Demo1234!';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);

  const submit = async () => {
    if (!email.trim()) return Alert.alert('Missing info', 'Enter username or email.');
    if (!password) return Alert.alert('Missing info', 'Enter your password.');
    if (email.trim().toLowerCase() !== DEMO_EMAIL) {
      return Alert.alert('Try the demo account', `Use ${DEMO_EMAIL} / ${DEMO_PASSWORD}`);
    }
    let stored = null;
    try {
      stored = await SecureStore.getItemAsync('maharlika_password');
    } catch {
      stored = null;
    }
    if (password !== (stored ?? DEMO_PASSWORD)) {
      return Alert.alert('Wrong password', 'Check your password or tap Forgot Password?');
    }
    try {
      await SecureStore.setItemAsync('maharlika_session', JSON.stringify({ email: DEMO_EMAIL, at: Date.now() }));
      const pin = await SecureStore.getItemAsync('maharlika_pin_set');
      if (!pin) {
        Alert.alert('Set a 4-digit PIN', 'First login: your PIN is stored as a salted hash (demo).', [
          { text: 'Later', onPress: () => router.replace('/(tabs)') },
          {
            text: 'Set PIN',
            onPress: async () => {
              await SecureStore.setItemAsync('maharlika_pin_set', '1');
              router.replace('/(tabs)');
            },
          },
        ]);
        return;
      }
    } catch {
      // SecureStore unavailable (web): continue as demo session
    }
    router.replace('/(tabs)');
  };

  const biometric = async (kind) => {
    try {
      const hasHw = await LocalAuthentication.hasHardwareAsync();
      if (!hasHw) return Alert.alert(kind, `${kind} hardware is not available on this device.`);
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      if (!enrolled) return Alert.alert(kind, `No ${kind === 'Face ID' ? 'face' : 'fingerprint'} enrolled. Use your password instead.`);
      const res = await LocalAuthentication.authenticateAsync({
        promptMessage: `Log in with ${kind}`,
        fallbackLabel: 'Use password',
        cancelLabel: 'Cancel',
      });
      if (res.success) router.replace('/(tabs)');
      else if (res.error !== 'user_cancel') Alert.alert(kind, 'Authentication did not complete. Try again.');
    } catch {
      Alert.alert(kind, 'Biometric login is unavailable right now.');
    }
  };

  return (
    <LinearGradient colors={['#006199', '#00456E']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.bg}>
      <View style={styles.leaf1} />
      <View style={styles.leaf2} />
      <SafeAreaView style={styles.safe} edges={[]}>
        <IOSStatusBar light />
        <View style={styles.content}>
          <View style={styles.brandWrap}>
            <MLogo light />
          </View>
          <Text style={styles.h1}>Login</Text>
          <Text style={styles.sub}>Welcome back. Let&apos;s make things happen.</Text>
          <View style={styles.inputRow}>
            <Feather name="user" size={20} color={colors.primary} />
            <TextInput value={email} onChangeText={setEmail} placeholder="Username or Email" placeholderTextColor="#64748B" style={styles.input} autoCapitalize="none" />
          </View>
          <View style={styles.inputRow}>
            <Feather name="lock" size={20} color={colors.primary} />
            <TextInput value={password} onChangeText={setPassword} placeholder="Password" placeholderTextColor="#64748B" secureTextEntry={!show} style={styles.input} />
            <Pressable onPress={() => setShow((v) => !v)} hitSlop={8}>
              <Text style={styles.show}>{show ? 'Hide' : 'Show'}</Text>
            </Pressable>
          </View>
          <Pressable onPress={submit} style={styles.primary}>
            <Text style={styles.primaryText}>Log In</Text>
          </Pressable>
          <Pressable onPress={() => Alert.alert('Forgot Password', 'A reset link was sent to your email.')} style={styles.center}>
            <Text style={styles.forgot}>Forgot Password?</Text>
          </Pressable>
          <Text style={styles.or}>Or log in securely with</Text>
          <View style={styles.bioRow}>
            <Pressable style={styles.bio} onPress={() => biometric('Fingerprint')} accessibilityRole="button" accessibilityLabel="Login with fingerprint">
              <MaterialCommunityIcons name="fingerprint" size={30} color="#FFFFFF" />
            </Pressable>
            <Pressable style={styles.bio} onPress={() => biometric('Face ID')} accessibilityRole="button" accessibilityLabel="Login with face ID">
              <MaterialCommunityIcons name="face-recognition" size={30} color="#FFFFFF" />
            </Pressable>
          </View>
          <Pressable onPress={() => Alert.alert('Sign Up', 'Create your Maharlika account in minutes.')} style={styles.center}>
            <Text style={styles.footer}>Don&apos;t have an account? <Text style={styles.signUp}>Sign Up</Text></Text>
          </Pressable>
          <View style={styles.homeBar} />
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
  leaf1: { position: 'absolute', right: -64, top: -64, width: 224, height: 224, borderRadius: 112, backgroundColor: 'rgba(255,255,255,0.06)' },
  leaf2: { position: 'absolute', left: -72, bottom: -72, width: 208, height: 208, borderRadius: 104, backgroundColor: 'rgba(255,255,255,0.05)' },
  safe: { flex: 1 },
  content: { flex: 1, paddingHorizontal: 24, paddingTop: 8, alignItems: 'stretch' },
  brandWrap: { alignItems: 'center', marginTop: 48, marginBottom: 32 },
  h1: { fontFamily: fonts.bold, fontSize: 32, color: colors.white },
  sub: { fontFamily: fonts.regular, fontSize: 14, color: 'rgba(255,255,255,0.72)', marginTop: 8, marginBottom: 24 },
  inputRow: { height: 56, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#E4EEF3', borderRadius: 16, marginBottom: 16 },
  input: { flex: 1, fontFamily: fonts.regular, fontSize: 15, color: colors.ink },
  show: { fontFamily: fonts.semiBold, fontSize: 14, color: colors.primary },
  primary: { height: 56, borderRadius: 28, backgroundColor: '#1F6FA3', alignItems: 'center', justifyContent: 'center', marginTop: 8 },
  primaryText: { fontFamily: fonts.semiBold, fontSize: 16, color: colors.white },
  center: { alignItems: 'center', marginTop: 16 },
  forgot: { fontFamily: fonts.semiBold, fontSize: 14, color: colors.white },
  or: { fontFamily: fonts.regular, fontSize: 13, color: 'rgba(255,255,255,0.65)', textAlign: 'center', marginTop: 24 },
  bioRow: { flexDirection: 'row', justifyContent: 'center', gap: 16, marginTop: 16 },
  bio: { width: 72, height: 64, borderRadius: 16, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.35)', alignItems: 'center', justifyContent: 'center' },
  footer: { fontFamily: fonts.regular, fontSize: 13, color: 'rgba(255,255,255,0.85)' },
  signUp: { fontFamily: fonts.semiBold, color: colors.white },
  homeBar: { width: 134, height: 5, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.9)', alignSelf: 'center', marginTop: 24 },
});
