import { useState } from 'react';
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { IOSStatusBar } from '../components/IOSStatusBar';
import { BottomNav, Label } from '../components/ui';
import { colors, fonts } from '../theme';
import { useStore } from '../store';

function formatPH(digits) {
  const d = digits.replace(/[^0-9]/g, '');
  const local = d.startsWith('63') ? `0${d.slice(2)}` : d;
  if (/^09\d{9}$/.test(local)) {
    return `+63 ${local.slice(1, 4)} ${local.slice(4, 7)} ${local.slice(7)}`;
  }
  return null;
}

export default function Account() {
  const { user, updateProfile } = useStore();
  const [editing, setEditing] = useState(null); // 'name' | 'email' | null
  const [draft, setDraft] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [numMsg, setNumMsg] = useState('');
  const [cur, setCur] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [pwMsg, setPwMsg] = useState('');
  const [showPw, setShowPw] = useState(false);

  const startEdit = (key, current) => {
    setEditing(key);
    setDraft(current);
  };

  const saveEdit = () => {
    const value = draft.trim();
    if (editing === 'name' && value.length < 3) {
      Alert.alert('Invalid name', 'Enter your full name.');
      return;
    }
    if (editing === 'email' && !/^\S+@\S+\.\S+$/.test(value)) {
      Alert.alert('Invalid email', 'Enter a valid email address.');
      return;
    }
    updateProfile({ [editing]: value });
    setEditing(null);
    setDraft('');
  };

  const saveNumber = () => {
    const formatted = formatPH(newNumber);
    if (!formatted) {
      setNumMsg('Enter an 11-digit mobile number starting with 09.');
      return;
    }
    updateProfile({ phone: formatted });
    setNewNumber('');
    setNumMsg('Mobile number updated.');
  };

  const savePassword = async () => {
    setPwMsg('');
    if (next.length < 8) {
      setPwMsg('New password must be at least 8 characters.');
      return;
    }
    if (next !== confirm) {
      setPwMsg('New passwords do not match.');
      return;
    }
    try {
      const stored = await SecureStore.getItemAsync('maharlika_password');
      const current = stored ?? 'Demo1234!';
      if (cur !== current) {
        setPwMsg('Current password is incorrect.');
        return;
      }
      await SecureStore.setItemAsync('maharlika_password', next);
      setCur('');
      setNext('');
      setConfirm('');
      setPwMsg('Password changed successfully.');
    } catch {
      setPwMsg('Could not save the new password on this device.');
    }
  };

  return (
    <View style={styles.safe}>
      <SafeAreaView style={{ backgroundColor: '#006199' }} edges={[]}>
        <IOSStatusBar light />
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} hitSlop={8} accessibilityRole="button" accessibilityLabel="Go back">
            <Feather name="arrow-left" size={24} color="#FFFFFF" />
          </Pressable>
          <Text style={styles.headerTitle}>Account Interface</Text>
          <View style={{ width: 24 }} />
        </View>
      </SafeAreaView>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.sheet} showsVerticalScrollIndicator={false}>
        <View style={styles.profile}>
          <Image source={require('../../assets/profile-photo.png')} style={styles.photo} />
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.phone}>{user.phone}</Text>
          <View style={styles.badge}>
            <Feather name="check-circle" size={14} color="#16A34A" />
            <Text style={styles.badgeText}>Verified</Text>
          </View>
        </View>

        <Label>Personal Info</Label>
        <View style={styles.card}>
          {[
            { key: 'name', label: 'Full Name', value: user.name },
            { key: 'email', label: 'Email', value: user.email },
          ].map((row, i, arr) => (
            <View key={row.key}>
              <View style={styles.row}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.rowLabel}>{row.label}</Text>
                  {editing === row.key ? (
                    <TextInput value={draft} onChangeText={setDraft} style={styles.editInput} autoFocus />
                  ) : (
                    <Text style={styles.rowValue}>{row.value}</Text>
                  )}
                </View>
                {editing === row.key ? (
                  <View style={styles.editBtns}>
                    <Pressable onPress={saveEdit} style={styles.saveBtn} accessibilityRole="button" accessibilityLabel={`Save ${row.label}`}>
                      <Text style={styles.saveText}>Save</Text>
                    </Pressable>
                    <Pressable onPress={() => setEditing(null)} accessibilityRole="button" accessibilityLabel="Cancel edit">
                      <Text style={styles.cancelText}>Cancel</Text>
                    </Pressable>
                  </View>
                ) : (
                  <Pressable onPress={() => startEdit(row.key, row.value)} hitSlop={8} accessibilityRole="button" accessibilityLabel={`Edit ${row.label}`}>
                    <Feather name="edit-2" size={18} color={colors.primary} />
                  </Pressable>
                )}
              </View>
              {i < arr.length - 1 && <View style={styles.divider} />}
            </View>
          ))}
        </View>

        <Label>Change Mobile Number</Label>
        <View style={styles.card}>
          <Text style={styles.rowLabel}>Current</Text>
          <Text style={styles.rowValue}>{user.phone}</Text>
          <TextInput
            value={newNumber}
            onChangeText={(t) => { setNewNumber(t.replace(/[^0-9]/g, '').slice(0, 11)); setNumMsg(''); }}
            placeholder="09XX XXX XXXX"
            placeholderTextColor="#64748B"
            keyboardType="numeric"
            style={styles.field}
          />
          {!!numMsg && <Text style={numMsg.includes('updated') ? styles.okMsg : styles.errMsg}>{numMsg}</Text>}
          <Pressable style={styles.primary} onPress={saveNumber} accessibilityRole="button" accessibilityLabel="Save new number">
            <Text style={styles.primaryText}>Update Number</Text>
          </Pressable>
        </View>

        <Label>Change Password</Label>
        <View style={styles.card}>
          <TextInput value={cur} onChangeText={setCur} placeholder="Current password" placeholderTextColor="#64748B" secureTextEntry={!showPw} style={styles.field} />
          <TextInput value={next} onChangeText={setNext} placeholder="New password (min 8 characters)" placeholderTextColor="#64748B" secureTextEntry={!showPw} style={styles.field} />
          <TextInput value={confirm} onChangeText={setConfirm} placeholder="Confirm new password" placeholderTextColor="#64748B" secureTextEntry={!showPw} style={styles.field} />
          <Pressable onPress={() => setShowPw((v) => !v)} hitSlop={8} accessibilityRole="button">
            <Text style={styles.showText}>{showPw ? 'Hide passwords' : 'Show passwords'}</Text>
          </Pressable>
          {!!pwMsg && <Text style={pwMsg.includes('successfully') ? styles.okMsg : styles.errMsg}>{pwMsg}</Text>}
          <Pressable style={styles.primary} onPress={savePassword} accessibilityRole="button" accessibilityLabel="Save new password">
            <Text style={styles.primaryText}>Update Password</Text>
          </Pressable>
        </View>

        <Pressable style={styles.logoutBtn} onPress={() => router.push('/modals/logout')} accessibilityRole="button" accessibilityLabel="Log out">
          <Text style={styles.logoutText}>Logout</Text>
        </Pressable>
      </ScrollView>
      <BottomNav active="profile" />
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#006199' },
  header: { flexDirection: 'row', alignItems: 'center', gap: 16, paddingHorizontal: 24, paddingTop: 8, paddingBottom: 32 },
  headerTitle: { flex: 1, fontFamily: fonts.bold, fontSize: 20, color: colors.white },
  scroll: { flex: 1, backgroundColor: '#F3F7FA', borderTopLeftRadius: 24, borderTopRightRadius: 24, marginTop: -20, overflow: 'hidden' },
  sheet: { padding: 16, gap: 12, paddingBottom: 32 },
  profile: { alignItems: 'center', paddingVertical: 8 },
  photo: { width: 88, height: 88, borderRadius: 44 },
  name: { fontFamily: fonts.bold, fontSize: 22, color: colors.ink, marginTop: 12 },
  phone: { fontFamily: fonts.regular, fontSize: 13, color: colors.muted, marginTop: 4 },
  badge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 16, paddingVertical: 4, borderRadius: 14, backgroundColor: '#E6F7EB', marginTop: 8 },
  badgeText: { fontFamily: fonts.semiBold, fontSize: 12, color: '#16A34A' },
  card: { backgroundColor: colors.white, borderRadius: 18, padding: 16, gap: 8, borderWidth: 1, borderColor: '#E4EEF3' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 4 },
  rowLabel: { fontFamily: fonts.regular, fontSize: 12, color: colors.muted },
  rowValue: { fontFamily: fonts.semiBold, fontSize: 15, color: colors.ink, marginTop: 2 },
  divider: { height: 1, backgroundColor: '#E4EEF3' },
  editInput: { fontFamily: fonts.regular, fontSize: 15, color: colors.ink, backgroundColor: '#E4EEF3', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8, marginTop: 4 },
  editBtns: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  saveBtn: { backgroundColor: '#006199', borderRadius: 16, paddingHorizontal: 16, paddingVertical: 8 },
  saveText: { fontFamily: fonts.semiBold, fontSize: 13, color: '#FFFFFF' },
  cancelText: { fontFamily: fonts.semiBold, fontSize: 13, color: colors.muted },
  field: { minHeight: 52, backgroundColor: '#E4EEF3', borderRadius: 12, paddingHorizontal: 14, fontFamily: fonts.regular, fontSize: 15, color: colors.ink },
  showText: { fontFamily: fonts.semiBold, fontSize: 13, color: colors.primary, paddingVertical: 4 },
  okMsg: { fontFamily: fonts.semiBold, fontSize: 13, color: '#16A34A' },
  errMsg: { fontFamily: fonts.semiBold, fontSize: 13, color: '#EF4444' },
  primary: { minHeight: 52, borderRadius: 26, backgroundColor: '#006199', alignItems: 'center', justifyContent: 'center', marginTop: 4 },
  primaryText: { fontFamily: fonts.semiBold, fontSize: 15, color: '#FFFFFF' },
  logoutBtn: { alignItems: 'center', paddingVertical: 12 },
  logoutText: { fontFamily: fonts.semiBold, fontSize: 15, color: '#EF4444' },
});
