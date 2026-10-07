import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getAppState, initDatabase, saveAppState, getTransactions, addTransactionToDb, deleteTransactionFromDb } from './services/db';

const WalletContext = createContext(null);

const seedTransactions = [];

const seedLinked = [
  { id: 'l1', name: 'Suki Wallet', detail: 'last 4 digits 0824', balance: 0, initial: 'S', color: '#5B8DBF' },
  { id: 'l2', name: 'Laya Wallet', detail: 'last 4 digits 6190', balance: 0, initial: 'L', color: '#7C6AB0' },
  { id: 'l3', name: 'Isla Bank Debit', detail: 'last 4 digits 4238', balance: 1500, initial: 'I', color: '#3E7CA8' },
  { id: 'l4', name: 'Bayan Bank Visa', detail: 'last 4 digits 9016', balance: 1500, initial: 'B', color: '#5A9E6F' },
];

const seedBillers = [
  { id: 'b1', name: 'Meralco', meta: 'Due Oct 15 · ₱1,298.00', amount: 1298, initial: 'M', color: '#E07B39' },
  { id: 'b2', name: 'Visayan Electric', meta: 'Due Oct 20 · ₱856.50', amount: 856.5, initial: 'V', color: '#3E7CA8' },
  { id: 'b3', name: 'Electricity', meta: 'Browse 24 electricity providers', amount: 0, initial: 'E', color: '#5A9E6F' },
  { id: 'b4', name: 'Credit Card', meta: 'Due Oct 25 · ₱2,450.00', amount: 2450, initial: 'C', color: '#5B6BA8' },
  { id: 'b5', name: 'Load Purchase', meta: 'Prepaid mobile & broadband', amount: 100, initial: 'L', color: '#5B8DBF' },
  { id: 'b6', name: 'Payment', meta: 'Government, insurance & more', amount: 0, initial: 'P', color: '#7C6AB0' },
];

export function StoreProvider({ children }) {
  // Offline-first: snapshot loads synchronously from SQLite on first render.
  // Seeds apply only when nothing was persisted (first run / corrupt snapshot).
  const [snapshot] = useState(() => {
    try {
      initDatabase();
      const raw = getAppState();
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });
  const [balance, setBalance] = useState(
    typeof snapshot?.balance === 'number' ? snapshot.balance : 10000,
  );
  const [transactions, setTransactions] = useState(() => {
    try {
      initDatabase();
      return getTransactions('');
    } catch {
      return seedTransactions;
    }
  });
  const [linked, setLinked] = useState(
    Array.isArray(snapshot?.linked) && snapshot.linked.length ? snapshot.linked : seedLinked,
  );
  const [billers, setBillers] = useState(
    Array.isArray(snapshot?.billers) && snapshot.billers.length ? snapshot.billers : seedBillers,
  );
  const [pushEnabled, setPushEnabled] = useState(
    typeof snapshot?.pushEnabled === 'boolean' ? snapshot.pushEnabled : true,
  );
  const [hidden, setHidden] = useState(
    typeof snapshot?.hidden === 'boolean' ? snapshot.hidden : false,
  );
  const [profile, setProfile] = useState(
    snapshot?.profile && typeof snapshot.profile === 'object' ? snapshot.profile : null,
  );
  const [security, setSecurity] = useState(
    snapshot?.security && typeof snapshot.security === 'object'
      ? snapshot.security
      : { biometric: true, twoStep: false },
  );
  const setSecurityFlag = (key, value) => setSecurity((prev) => ({ ...prev, [key]: value }));
  const [notifications, setNotifications] = useState(
    Array.isArray(snapshot?.notifications) ? snapshot.notifications : [],
  );

  const addNotification = (title, body) => {
    setToast(`${title}: ${body}`);
    setNotifications((prev) => [
      { id: `n${Date.now()}`, title, body, when: 'Just now', unread: true, detail: body },
      ...prev,
    ].slice(0, 20));
  };

  const markNotificationRead = (id) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, unread: false } : n)));
  };

  const readAllNotifications = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const deleteNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const [toast, setToast] = useState(null);
  const clearToast = () => setToast(null);

  // Write-through: every change lands in SQLite immediately.
  useEffect(() => {
    try {
      saveAppState(JSON.stringify({ balance, transactions, linked, billers, pushEnabled, hidden, profile, security, notifications }));
    } catch {
      // storage full/unavailable: app keeps working in memory
    }
  }, [balance, transactions, linked, billers, pushEnabled, hidden, profile, security, notifications]);

  const user = useMemo(
    () => ({
      name: 'Juan Dela Cruz',
      phone: '+63 912 345 6789',
      email: 'juan.delacruz@mail.ph',
      id: '0912 345 6789',
      ...(profile ?? {}),
    }),
    [profile],
  );

  const updateProfile = (patch) => setProfile((prev) => ({ ...(prev ?? {}), ...patch }));

  const addTransaction = (tx) => {
    // Use the SQLite rowid so deleteTransactionFromDb can match the row.
    const rowId = addTransactionToDb(tx);
    const withId = { id: String(rowId), ...tx };
    setTransactions((prev) => [withId, ...prev]);
  };

  const deleteTransaction = (id) => {
    deleteTransactionFromDb(id);
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  const resetDemoData = () => {
    setBalance(10000);
    setTransactions([]);
    setLinked(seedLinked);
    setProfile(null);
  };

  const sendMoney = (recipient, amount, message) => {
    if (amount <= 0 || amount > balance) return false;
    setBalance((b) => +(b - amount).toFixed(2));
    addTransaction({
      title: 'Transfer',
      sub: `To ${recipient} · Just now${message ? ` · ${message}` : ''}`,
      amount: -amount,
      kind: 'sent',
      icon: 'send',
    });
    addNotification('Transfer sent', `You sent ₱${amount.toLocaleString('en-PH', { minimumFractionDigits: 2 })} to ${recipient}.`);
    return true;
  };

  const payBiller = (biller, accountNo) => {
    const amt = biller.amount;
    if (amt <= 0 || amt > balance) return false;
    setBalance((b) => +(b - amt).toFixed(2));
    addTransaction({
      title: biller.name,
      sub: `${accountNo ? `${accountNo} · ` : ''}Just now`,
      amount: -amt,
      kind: 'bills',
      icon: 'zap',
    });
    addNotification('Bill paid', `${biller.name} payment of ₱${amt.toLocaleString('en-PH', { minimumFractionDigits: 2 })} was successful.`);
    return true;
  };

  const topUp = (amount, place = 'Partner Store') => {
    setBalance((b) => +(b + amount).toFixed(2));
    addTransaction({
      title: 'Cash In',
      sub: `via ${place} · Just now`,
      amount,
      kind: 'received',
      icon: 'arrow-down-left',
    });
    addNotification('Cash in received', `₱${amount.toLocaleString('en-PH', { minimumFractionDigits: 2 })} was added via ${place}.`);
  };

  const cashOut = (amount, place = 'Partner Store') => {
    if (amount <= 0 || amount > balance) return false;
    setBalance((b) => +(b - amount).toFixed(2));
    addTransaction({
      title: 'Cash Out',
      sub: `via ${place} · Just now`,
      amount: -amount,
      kind: 'sent',
      icon: 'arrow-up-right',
    });
    addNotification('Cash out recorded', `₱${amount.toLocaleString('en-PH', { minimumFractionDigits: 2 })} was withdrawn via ${place}.`);
    return true;
  };

  const adjustLinkedBalance = (id, delta) => {
    setLinked((prev) => prev.map((l) => (l.id === id ? { ...l, balance: +((l.balance ?? 0) + delta).toFixed(2) } : l)));
  };

  const adjustBalance = (delta) => {
    setBalance((b) => +(b + delta).toFixed(2));
  };

  const addLinked = (entry) => {
    setLinked((prev) => [...prev, { id: `l${Date.now()}`, balance: 0, ...entry }]);
  };

  const addBiller = (entry) => {
    setBillers((prev) => [
      ...prev,
      { id: `b${Date.now()}`, initial: entry.name.trim().charAt(0).toUpperCase(), color: '#006199', meta: 'Custom bill', amount: 0, ...entry },
    ]);
  };

  const value = useMemo(
    () => ({ balance, transactions, linked, billers, user, pushEnabled, hidden, setPushEnabled, setHidden, security, setSecurityFlag, notifications, addNotification, markNotificationRead, readAllNotifications, deleteNotification, toast, clearToast, sendMoney, payBiller, topUp, cashOut, adjustBalance, adjustLinkedBalance, updateProfile, addTransaction, addLinked, addBiller, deleteTransaction, resetDemoData }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [balance, transactions, linked, billers, user, pushEnabled, hidden, security, notifications, toast],
  );
  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
}

export function useStore() {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error('useStore must be used inside StoreProvider');
  return ctx;
}

export function formatPeso(n, decimals = 2) {
  const sign = n < 0 ? '−₱' : '₱';
  return `${sign}${Math.abs(n).toLocaleString('en-PH', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}`;
}

export function formatSigned(n) {
  const sign = n < 0 ? '−₱' : '+₱';
  return `${sign}${Math.abs(n).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function formatSignedExact(n) {
  const sign = n < 0 ? '−₱' : '+₱';
  return `${sign}${Math.abs(n).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export const LIMITS = [
  { label: 'Send Money (daily)', used: 2500, max: 50000 },
  { label: 'Bills Payment (daily)', used: 1298, max: 50000 },
  { label: 'Cash In (monthly)', used: 12000, max: 100000 },
];
