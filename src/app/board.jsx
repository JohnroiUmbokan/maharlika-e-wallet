import { Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { fonts } from '../theme';
import { MMark } from '../components/MLogo';

const GOLD = '#FFC107';
const PRIMARY = '#006199';
const DEEP = '#062A44';

function StatusMini({ dark = false }) {
  return (
    <View style={mini.status}>
      <Text style={[mini.time, { color: dark ? '#FFF' : '#0F172A' }]}>9:41</Text>
      <View style={mini.sicons}>
        <View style={mini.bars}>{[4, 6, 8].map((h) => <View key={h} style={[mini.bar, { height: h, backgroundColor: dark ? '#FFF' : '#0F172A' }]} />)}</View>
        <View style={[mini.batt, { borderColor: dark ? '#FFF' : '#0F172A' }]}><View style={[mini.battFill, { backgroundColor: dark ? '#FFF' : '#0F172A' }]} /></View>
      </View>
    </View>
  );
}

function HeaderMini({ title, back = true }) {
  return (
    <View style={mini.header}>
      {back ? <Feather name="arrow-left" size={10} color="#FFF" /> : <View style={{ width: 10 }} />}
      <Text style={mini.headerTitle} numberOfLines={1}>{title}</Text>
      <Feather name="more-horizontal" size={10} color="#FFF" />
    </View>
  );
}

function Sheet({ children }) {
  return <View style={mini.sheet}>{children}</View>;
}

function PillBtn({ label }) {
  return (
    <View style={mini.pill}>
      <Text style={mini.pillText}>{label}</Text>
    </View>
  );
}

function TabMini({ active }) {
  const icons = [
    { icon: 'home', key: 0 },
    { icon: 'credit-card', key: 1 },
    { icon: 'qr' },
    { icon: 'file-text', key: 2 },
    { icon: 'user', key: 3 },
  ];
  return (
    <View style={mini.tab}>
      {icons.map((it) => it.icon === 'qr' ? (
        <View key="qr" style={mini.qrMini}>
          <Feather name="maximize-2" size={9} color="#FFF" />
        </View>
      ) : (
        <Feather key={it.icon} name={it.icon} size={10} color={it.key === active ? PRIMARY : '#B6C5D2'} />
      ))}
    </View>
  );
}

function TxRow({ neg, label, amt }) {
  return (
    <View style={mini.row}>
      <View style={mini.dot} />
      <View style={{ flex: 1 }}>
        <View style={mini.line} />
        <View style={[mini.line, { width: 44, opacity: 0.5 }]} />
      </View>
      <Text style={[mini.amt, { color: neg ? '#EF4444' : '#16A34A' }]}>{amt}</Text>
    </View>
  );
}

// 12 mini previews
function SplashMini() {
  return (
    <LinearGradient colors={[PRIMARY, DEEP]} style={mini.body} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
      <StatusMini dark />
      <Text style={mini.splashH}>Send. Pay. Save.{'\n'}All in Maharlika.</Text>
      <View style={mini.cardPair}>
        <View style={[mini.debit, { backgroundColor: DEEP, transform: [{ rotate: '-8deg' }] }]} />
        <View style={[mini.debit, { backgroundColor: PRIMARY, marginTop: -52, transform: [{ rotate: '-12deg' }] }]}>
          <View style={[mini.chip, { backgroundColor: GOLD }]} />
        </View>
      </View>
      <PillBtn label="Get Started" />
      <Text style={mini.link}>Login</Text>
    </LinearGradient>
  );
}

function LoginMini() {
  return (
    <LinearGradient colors={[PRIMARY, DEEP]} style={mini.body} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
      <StatusMini dark />
      <View style={{ alignItems: 'center', marginTop: 6 }}><MMark size={22} background={PRIMARY} /></View>
      <Text style={mini.loginT}>Login</Text>
      <View style={mini.field} /><View style={mini.field} />
      <PillBtn label="Log In" />
      <View style={mini.bioMini}>
        <View style={mini.bioDot} /><View style={mini.bioDot} />
      </View>
      <Text style={mini.link}>Forgot Password?</Text>
    </LinearGradient>
  );
}

function HomeMini() {
  return (
    <View style={[mini.body, { backgroundColor: '#FFF' }]}>
      <View style={{ backgroundColor: PRIMARY }}><StatusMini dark /><Text style={mini.hello}>Good morning, Juan Dela Cruz</Text></View>
      <Sheet>
        <View style={mini.walletCard}><Text style={mini.walletT}>₱5,432.18</Text></View>
        <View style={mini.tiles}>{[0, 1, 2, 3].map((i) => <View key={i} style={mini.tile} />)}</View>
        <TxRow neg label amt="−₱500.00" /><TxRow neg label amt="−₱100.00" /><TxRow label amt="+₱1,000.00" />
      </Sheet>
      <TabMini active={0} />
    </View>
  );
}

function WalletMini() {
  return (
    <View style={[mini.body, { backgroundColor: '#FFF' }]}>
      <View style={{ backgroundColor: PRIMARY }}><StatusMini dark /><HeaderMini title="Wallet" /></View>
      <Sheet>
        <View style={mini.bankRow}>
          {[0, 1].map((i) => (
            <View key={i} style={mini.bank}>
              <View style={mini.bankDot} />
              <View style={[mini.line, { width: 56 }]} />
              <Text style={mini.bankBal}>₱1,500.00</Text>
            </View>
          ))}
        </View>
        {[0, 1, 2].map((i) => <View key={i} style={mini.row}><View style={mini.dot} /><View style={mini.line} /></View>)}
        <View style={mini.softBtn}><Text style={mini.softT}>Link a New Account</Text></View>
      </Sheet>
      <TabMini active={1} />
    </View>
  );
}

function ScanMini() {
  return (
    <View style={[mini.body, { backgroundColor: DEEP }]}>
      <StatusMini dark /><HeaderMini title="Scan & Pay" />
      <View style={mini.scanFrame}><View style={mini.scanQr} /><View style={mini.scanLine} /></View>
      <View style={mini.outlineBtn}><Text style={mini.outlineT}>Generate QR & Add Amount</Text></View>
      <View style={mini.outlineBtn}><Text style={mini.outlineT}>My QR Code</Text></View>
    </View>
  );
}

function ProfileMini() {
  return (
    <View style={[mini.body, { backgroundColor: '#FFF' }]}>
      <View style={{ backgroundColor: PRIMARY }}><StatusMini dark /><HeaderMini title="Maharlika" back={false} /></View>
      <Sheet>
        <View style={mini.avatar} />
        <View style={mini.verified}><Text style={mini.verifiedT}>Verified</Text></View>
        {[0, 1, 2, 3, 4].map((i) => <View key={i} style={mini.row}><View style={mini.dot} /><View style={mini.line} /></View>)}
        <Text style={[mini.amt, { color: '#EF4444' }]}>Logout</Text>
      </Sheet>
      <TabMini active={3} />
    </View>
  );
}

function SendMini() {
  return (
    <View style={[mini.body, { backgroundColor: '#FFF' }]}>
      <View style={{ backgroundColor: PRIMARY }}><StatusMini dark /><HeaderMini title="Send Money" /></View>
      <Sheet>
        <View style={mini.field} />
        <Text style={mini.bigAmt}>₱0.00</Text>
        <View style={mini.chips}>{[0, 1, 2].map((i) => <View key={i} style={mini.chipMini} />)}</View>
        <View style={[mini.field, { height: 28 }]} />
        <PillBtn label="Continue" />
      </Sheet>
      <TabMini active={0} />
    </View>
  );
}

function AccountMini() {
  return (
    <View style={[mini.body, { backgroundColor: '#D7E3EC' }]}>
      <View style={{ backgroundColor: PRIMARY }}><StatusMini dark /><HeaderMini title="Maharlika" back={false} /></View>
      <View style={mini.avatar} />
      <View style={mini.dimSheet}>
        <View style={mini.outlineBtn}><Text style={mini.outlineT}>Generate QR & Add Amount</Text></View>
        <View style={mini.outlineBtn}><Text style={mini.outlineT}>My QR Code</Text></View>
        <Text style={mini.link}>Logout</Text>
      </View>
    </View>
  );
}

function GenerateMini() {
  return (
    <View style={[mini.body, { backgroundColor: '#FFF' }]}>
      <View style={{ backgroundColor: PRIMARY }}><StatusMini dark /><HeaderMini title="Generate QR" /></View>
      <Sheet>
        <View style={mini.field} />
        <View style={mini.field} />
        <Text style={mini.bigAmt}>₱0.00</Text>
        <PillBtn label="Generate QR" />
      </Sheet>
      <TabMini active={0} />
    </View>
  );
}

function BillsMini() {
  return (
    <View style={[mini.body, { backgroundColor: '#FFF' }]}>
      <View style={{ backgroundColor: PRIMARY }}><StatusMini dark /><HeaderMini title="Pay Bills" /></View>
      <Sheet>
        <View style={mini.field} />
        {[0, 1, 2, 3, 4].map((i) => <View key={i} style={mini.row}><View style={mini.dot} /><View style={mini.line} /></View>)}
      </Sheet>
      <TabMini active={2} />
    </View>
  );
}

function FinalBillMini() {
  return (
    <View style={[mini.body, { backgroundColor: '#FFF' }]}>
      <View style={{ backgroundColor: PRIMARY }}><StatusMini dark /><HeaderMini title="Bill Payment" /></View>
      <Sheet>
        <View style={mini.field} />
        <View style={mini.field} />
        <View style={mini.field} />
        <PillBtn label="Pay" />
      </Sheet>
      <TabMini active={2} />
    </View>
  );
}

function ReceiptMini() {
  return (
    <View style={[mini.body, { backgroundColor: '#FFF' }]}>
      <View style={{ backgroundColor: PRIMARY }}><StatusMini dark /><HeaderMini title="Receipt" /></View>
      <Sheet>
        <View style={mini.receipt}>
          <View style={mini.zzMini} />
          <Text style={mini.ok}>Successful!</Text>
          <View style={mini.line} /><View style={mini.line} />
          <Text style={mini.bigAmt}>₱1,298.00</Text>
          <View style={mini.barcode} />
        </View>
        <PillBtn label="Share Receipt" />
      </Sheet>
      <TabMini active={2} />
    </View>
  );
}

const SCREENS = [
  { n: '01 Splash', route: '/onboarding', El: SplashMini },
  { n: '02 Login', route: '/login', El: LoginMini },
  { n: '03 Home', route: '/(tabs)', El: HomeMini },
  { n: '04 Wallet Management', route: '/(tabs)/wallet', El: WalletMini },
  { n: '05 Scan & Pay', route: '/scan', El: ScanMini },
  { n: '06 Profile', route: '/(tabs)/profile', El: ProfileMini },
  { n: '07 Send Money', route: '/send', El: SendMini },
  { n: '08 Account / QR Sheet', route: '/account', El: AccountMini },
  { n: '09 Generate QR', route: '/generate-qr', El: GenerateMini },
  { n: '10 Pay Bills', route: '/(tabs)/bills', El: BillsMini },
  { n: '11 Final Bill Payment', route: '/bill-pay', El: FinalBillMini },
  { n: '12 Receipt', route: '/receipt', El: ReceiptMini },
];

export default function Board() {
  const { width } = useWindowDimensions();
  const perRow = width > 700 ? 6 : 3;
  const phoneW = Math.max(140, (width - 48) / perRow - 12);
  const phoneH = phoneW * 2.02;
  return (
    <View style={styles.tabletop}>
      {/* plant leaf entering top-right */}
      <View style={styles.leaf} />
      <View style={styles.leaf2} />
      {/* soft shadow bottom-left */}
      <View style={styles.floorShadow} />
      <SafeAreaView style={{ flex: 1 }} edges={[]}>
        <View style={styles.head}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <MMark size={28} background={PRIMARY} />
            <Text style={styles.brand}>Maharlika</Text>
          </View>
          <Text style={styles.sub}>GCash-style e-wallet · 12-screen UI kit · 3:2 board</Text>
        </View>
        <ScrollView contentContainerStyle={styles.grid} showsVerticalScrollIndicator={false}>
          {SCREENS.map(({ n, route, El }) => (
            <Pressable key={n} onPress={() => router.push(route)} style={{ width: phoneW, alignItems: 'center' }}>
              <View style={[styles.phone, { width: phoneW, height: phoneH }]}>
                <View style={[styles.screen, { width: phoneW - 10, height: phoneH - 10 }]}>
                  <El />
                </View>
              </View>
              <Text style={styles.caption}>{n}</Text>
            </Pressable>
          ))}
        </ScrollView>
        <Text style={styles.hint}>Tap any phone to open the live screen. 8px grid · Poppins/Inter · #006199 / #FFC107.</Text>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  tabletop: { flex: 1, backgroundColor: '#DCE9EE' },
  leaf: { position: 'absolute', top: -70, right: -50, width: 220, height: 220, borderRadius: 110, backgroundColor: '#2F7D4F', opacity: 0.9, transform: [{ rotate: '24deg' }] },
  leaf2: { position: 'absolute', top: -40, right: 60, width: 140, height: 140, borderRadius: 70, backgroundColor: '#3E9E63', opacity: 0.85 },
  floorShadow: { position: 'absolute', left: -80, bottom: -100, width: 320, height: 220, borderRadius: 110, backgroundColor: 'rgba(60,40,20,0.12)' },
  head: { paddingHorizontal: 24, paddingTop: 18, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  brand: { fontFamily: fonts.bold, fontSize: 22, color: '#0F172A' },
  sub: { fontFamily: fonts.regular, fontSize: 10, color: '#64748B', flexShrink: 1, textAlign: 'right', marginLeft: 16 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, padding: 20, justifyContent: 'center', paddingBottom: 12 },
  phone: { backgroundColor: '#111827', borderRadius: 26, padding: 5, shadowColor: '#000', shadowOpacity: 0.22, shadowRadius: 12, shadowOffset: { width: 0, height: 6 }, elevation: 8, alignItems: 'center', justifyContent: 'center' },
  screen: { backgroundColor: '#FFF', borderRadius: 21, overflow: 'hidden' },
  caption: { fontFamily: fonts.semiBold, fontSize: 10, color: '#0F172A', marginTop: 6 },
  hint: { fontFamily: fonts.regular, fontSize: 11, color: '#64748B', textAlign: 'center', paddingBottom: 18 },
});

const mini = StyleSheet.create({
  body: { flex: 1 },
  status: { height: 20, paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  time: { fontFamily: fonts.semiBold, fontSize: 8 },
  sicons: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  bars: { flexDirection: 'row', alignItems: 'flex-end', gap: 1 },
  bar: { width: 2, borderRadius: 1 },
  batt: { width: 14, height: 8, borderWidth: 1, borderRadius: 2, padding: 1 },
  battFill: { flex: 1, borderRadius: 1 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 10, paddingBottom: 12, backgroundColor: PRIMARY },
  headerTitle: { flex: 1, fontFamily: fonts.bold, fontSize: 10, color: '#FFF' },
  sheet: { flex: 1, backgroundColor: '#FFF', borderTopLeftRadius: 12, borderTopRightRadius: 12, marginTop: -10, padding: 10, gap: 6 },
  pill: { height: 24, borderRadius: 12, backgroundColor: PRIMARY, alignItems: 'center', justifyContent: 'center', marginHorizontal: 10 },
  pillText: { fontFamily: fonts.semiBold, fontSize: 9, color: '#FFF' },
  tab: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', backgroundColor: '#FFF', borderTopWidth: 1, borderTopColor: '#E4EEF3', paddingVertical: 6 },
  qrMini: { width: 24, height: 24, borderRadius: 12, backgroundColor: PRIMARY, borderWidth: 2, borderColor: GOLD, alignItems: 'center', justifyContent: 'center', marginTop: -14 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 3 },
  dot: { width: 18, height: 18, borderRadius: 9, backgroundColor: '#E4F1F8' },
  line: { height: 6, borderRadius: 3, backgroundColor: '#E4EEF3', width: 72, marginVertical: 1 },
  amt: { fontFamily: fonts.semiBold, fontSize: 8 },
  splashH: { fontFamily: fonts.bold, fontSize: 13, color: '#FFF', paddingHorizontal: 12, marginTop: 4, lineHeight: 16 },
  cardPair: { alignItems: 'center', marginVertical: 8 },
  debit: { width: 110, height: 64, borderRadius: 10, padding: 8 },
  chip: { width: 18, height: 13, borderRadius: 3 },
  link: { fontFamily: fonts.medium, fontSize: 8, color: '#FFF', textAlign: 'center', marginTop: 6, opacity: 0.9 },
  loginT: { fontFamily: fonts.bold, fontSize: 13, color: '#FFF', paddingHorizontal: 12, marginTop: 6 },
  field: { height: 22, borderRadius: 8, backgroundColor: '#E4EEF3', marginHorizontal: 10 },
  hello: { fontFamily: fonts.semiBold, fontSize: 9, color: '#FFF', paddingHorizontal: 10, paddingBottom: 14 },
  walletCard: { backgroundColor: PRIMARY, borderRadius: 10, padding: 10 },
  walletT: { fontFamily: fonts.bold, fontSize: 14, color: '#FFF' },
  tiles: { flexDirection: 'row', justifyContent: 'space-between' },
  tile: { width: 26, height: 26, borderRadius: 8, backgroundColor: '#E4F1F8' },
  bankRow: { flexDirection: 'row', gap: 6 },
  bank: { flex: 1, borderRadius: 10, backgroundColor: '#E4F1F8', padding: 8, gap: 4 },
  bankDot: { width: 16, height: 16, borderRadius: 8, backgroundColor: '#006199' },
  bankBal: { fontFamily: fonts.bold, fontSize: 10, color: '#006199' },
  softBtn: { height: 22, borderRadius: 8, backgroundColor: '#CFE4F0', alignItems: 'center', justifyContent: 'center' },
  softT: { fontFamily: fonts.semiBold, fontSize: 8, color: PRIMARY },
  scanFrame: { height: 110, margin: 12, borderWidth: 2, borderColor: '#FFF', borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  scanQr: { width: 64, height: 64, backgroundColor: '#FFF', borderRadius: 6, opacity: 0.9 },
  scanLine: { position: 'absolute', width: '86%', height: 2, backgroundColor: '#16A34A' },
  outlineBtn: { height: 24, borderRadius: 12, backgroundColor: '#0D3A5C', borderWidth: 1, borderColor: 'rgba(255,255,255,0.35)', alignItems: 'center', justifyContent: 'center', marginHorizontal: 10, marginTop: 6 },
  outlineT: { fontFamily: fonts.semiBold, fontSize: 8, color: '#FFF' },
  avatar: { width: 30, height: 30, borderRadius: 15, backgroundColor: '#CFE4F0', alignSelf: 'center', marginTop: 8 },
  verified: { backgroundColor: '#E6F7EB', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 2, alignSelf: 'center' },
  verifiedT: { fontFamily: fonts.semiBold, fontSize: 8, color: '#16A34A' },
  bigAmt: { fontFamily: fonts.bold, fontSize: 18, color: '#0F172A', textAlign: 'left', paddingHorizontal: 10 },
  chips: { flexDirection: 'row', gap: 4, justifyContent: 'center' },
  chipMini: { width: 34, height: 14, borderRadius: 7, backgroundColor: '#E4F1F8' },
  dimSheet: { backgroundColor: '#0F4E7E', borderTopLeftRadius: 12, borderTopRightRadius: 12, padding: 10, gap: 4, marginTop: 8, flex: 1 },
  bioMini: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginHorizontal: 10 },
  bioDot: { width: 40, height: 28, borderRadius: 8, borderWidth: 1, borderColor: 'rgba(255,255,255,0.5)' },
  receipt: { backgroundColor: '#FFF', borderWidth: 1, borderColor: '#E4EEF3', borderRadius: 10, padding: 8, alignItems: 'center', gap: 4, overflow: 'hidden', paddingTop: 4 },
  zzMini: { alignSelf: 'stretch', borderTopWidth: 2, borderStyle: 'dashed', borderColor: '#E4EEF3', marginHorizontal: 2 },
  ok: { fontFamily: fonts.bold, fontSize: 10, color: '#16A34A' },
  barcode: { width: 90, height: 18, backgroundColor: '#0F172A', opacity: 0.85, borderRadius: 2 },
});
