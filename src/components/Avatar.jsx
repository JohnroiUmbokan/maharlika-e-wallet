import { StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '../theme';

export function Avatar({ size = 42, label = 'JU' }) {
  return (
    <View style={[styles.circle, { width: size, height: size, borderRadius: size / 2 }]}>
      <Text style={[styles.text, { fontSize: size * 0.34 }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  circle: {
    backgroundColor: colors.primary,
    borderWidth: 2,
    borderColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: { color: colors.white, fontFamily: fonts.bold },
});
