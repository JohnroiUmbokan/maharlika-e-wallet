import { StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '../theme';

export function IOSStatusBar({ light = false }) {
  const fg = light ? colors.white : colors.white;
  return (
    <View style={styles.wrap}>
      <Text style={[styles.time, { color: fg }]}>9:41</Text>
      <View style={styles.icons}>
        <View style={styles.signal}>
          {[4, 6, 8, 10].map((h) => (
            <View key={h} style={[styles.bar, { height: h, backgroundColor: fg }]} />
          ))}
        </View>
        <View style={styles.wifi}>
          <View style={[styles.wifiArc, { borderColor: fg }]} />
        </View>
        <View style={[styles.battery, { borderColor: fg }]}>
          <View style={[styles.batteryFill, { backgroundColor: fg }]} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    height: 48,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  time: { fontFamily: fonts.semiBold, fontSize: 15 },
  icons: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  signal: { flexDirection: 'row', alignItems: 'flex-end', gap: 2 },
  bar: { width: 3, borderRadius: 1 },
  wifi: { width: 18, height: 14, alignItems: 'center', justifyContent: 'center' },
  wifiArc: { width: 12, height: 12, borderWidth: 2, borderRadius: 8, borderBottomColor: 'transparent', borderLeftColor: 'transparent', transform: [{ rotate: '45deg' }] },
  battery: { width: 26, height: 13, borderWidth: 1, borderRadius: 4, padding: 2, justifyContent: 'center' },
  batteryFill: { flex: 1, borderRadius: 1 },
});
