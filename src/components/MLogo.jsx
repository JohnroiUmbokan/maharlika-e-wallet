import { StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '../theme';

// Bold geometric "M" with a leaf-like cut in its left stroke.
// On dark headers: transparent background, white glyph (matches mockups).
// Pass background={colors.primary} for a boxed mark on light surfaces.
export function MMark({ size = 34, background = 'transparent' }) {
  const boxed = background !== 'transparent';
  return (
    <View
      style={[
        styles.mark,
        { width: size, height: size, backgroundColor: background, borderRadius: boxed ? size * 0.28 : 0 },
      ]}
    >
      <Text style={[styles.m, { fontSize: size * 0.8 }]}>M</Text>
      {/* gold leaf highlight cutting the left stroke */}
      <View style={[styles.leaf, { width: size * 0.2, height: size * 0.2, top: size * 0.16, left: size * 0.12 }]} />
    </View>
  );
}

export function MLogo({ light = false, markBackground }) {
  const fg = light ? '#FFFFFF' : colors.ink;
  return (
    <View style={styles.row}>
      <MMark size={32} background={markBackground ?? (light ? 'transparent' : colors.primary)} />
      <Text style={[styles.word, { color: fg }]}>Maharlika</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  mark: { alignItems: 'center', justifyContent: 'center', overflow: 'visible' },
  m: { fontFamily: fonts.bold, color: '#FFFFFF' },
  leaf: { position: 'absolute', borderRadius: 10, backgroundColor: colors.gold, transform: [{ rotate: '-32deg' }], borderTopRightRadius: 2 },
  word: { fontFamily: fonts.bold, fontSize: 22 },
});
