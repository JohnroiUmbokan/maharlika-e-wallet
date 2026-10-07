import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { colors, fonts } from '../../theme';

export default function LogoutModal() {
  const logout = async () => {
    try {
      await SecureStore.deleteItemAsync('maharlika_session');
    } catch {
      // demo: session clear is best-effort
    }
    router.replace('/login');
  };

  return (
    <View style={s.bg}>
      <View style={s.check}>
        <Feather name="check" size={40} color="#006199" />
      </View>
      <View style={s.modal}>
        <Text style={s.title}>Are you sure you want to log out?</Text>
        <Text style={s.body}>You will need to log in again to access your wallet.</Text>
        <Pressable style={s.logout} onPress={logout} accessibilityRole="button" accessibilityLabel="Log out">
          <Text style={s.logoutText}>Log Out</Text>
        </Pressable>
        <Pressable onPress={() => router.back()} accessibilityRole="button" accessibilityLabel="Cancel logout">
          <Text style={s.cancel}>Cancel</Text>
        </Pressable>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  bg: { flex: 1, backgroundColor: '#E4F1F8', alignItems: 'center', justifyContent: 'center', padding: 24, gap: 24 },
  check: { width: 96, height: 96, borderRadius: 48, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#E4EEF3' },
  modal: { backgroundColor: colors.white, borderRadius: 20, padding: 24, gap: 12, width: '100%', alignItems: 'center' },
  title: { fontFamily: fonts.bold, fontSize: 17, color: colors.ink, textAlign: 'center' },
  body: { fontFamily: fonts.regular, fontSize: 13, color: colors.muted, textAlign: 'center' },
  logout: { minHeight: 52, borderRadius: 26, backgroundColor: '#EF4444', alignItems: 'center', justifyContent: 'center', alignSelf: 'stretch' },
  logoutText: { fontFamily: fonts.semiBold, fontSize: 16, color: '#FFFFFF' },
  cancel: { fontFamily: fonts.semiBold, fontSize: 15, color: colors.ink, paddingVertical: 8 },
});
