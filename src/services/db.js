import * as SQLite from 'expo-sqlite';
import { documentDirectory, getInfoAsync } from 'expo-file-system/legacy';

// Single source of truth: the transactions ledger. Balance is always derived
// as SUM(deposits) - SUM(withdrawals), so it can never drift or reseed.
export const db = SQLite.openDatabaseSync('maharlika_wallet.db');

const OUTGOING_TYPES = ['Send', 'Bill', 'Load'];

// Force WAL content into the main database file. If only the main file (and
// not the -wal sidecar) survives an app kill — as happens in some sandboxes,
// private browsing, or unclean shutdowns — uncheckpointed writes vanish.
function checkpoint() {
  try {
    db.execSync('PRAGMA wal_checkpoint(TRUNCATE);');
  } catch {
    // checkpoint is best-effort; the data is already committed
  }
}

export function initDatabase() {
  db.execSync(`PRAGMA journal_mode = WAL;`);
  db.execSync(`
    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT NOT NULL CHECK (type IN ('Cash-in', 'Send', 'Receive', 'Bill', 'Load')),
      amount REAL NOT NULL,
      recipient TEXT,
      timestamp TEXT NOT NULL
    );
  `);

  // Migrate Lab-05 v1 schema (used `date`/`note`) to the `timestamp` column.
  const cols = db.getAllSync(`PRAGMA table_info(transactions);`).map((c) => c.name);
  if (!cols.includes('timestamp')) {
    db.execSync(`ALTER TABLE transactions ADD COLUMN timestamp TEXT;`);
    if (cols.includes('date')) {
      db.execSync(`UPDATE transactions SET timestamp = date WHERE timestamp IS NULL;`);
    }
    db.execSync(`UPDATE transactions SET timestamp = ? WHERE timestamp IS NULL;`, [
      new Date().toISOString(),
    ]);
  }

  // Retire the old single-row wallet table; balance now comes from the ledger.
  db.execSync(`DROP TABLE IF EXISTS wallet;`);

  // Key-value snapshot for the main app store (balance, transactions, linked
  // accounts, preferences) so the whole Maharlika app survives restarts.
  db.execSync(`
    CREATE TABLE IF NOT EXISTS app_state (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `);

  // Seed exactly once: only when the ledger is completely empty (first launch).
  const countRow = db.getFirstSync('SELECT COUNT(*) AS count FROM transactions;');
  const seeded = countRow.count === 0;
  if (seeded) {
    db.runSync(
      'INSERT INTO transactions (type, amount, recipient, timestamp) VALUES (?, ?, ?, ?);',
      ['Cash-in', 5000, 'Initial Balance', new Date().toISOString()],
    );
  }
  checkpoint();
  return { seeded, rows: getTransactionCount() };
}

function getTransactionCount() {
  return db.getFirstSync('SELECT COUNT(*) AS count FROM transactions;').count;
}

// Diagnostics for tracking down storage resets. Reports the real on-disk file
// (not just what SQLite sees in this session).
export async function getDbDiagnostics() {
  const base = documentDirectory ?? '';
  const fs = { exists: false, size: 0, modificationTime: 0 };
  if (base) {
    try {
      const info = await getInfoAsync(`${base}SQLite/maharlika_wallet.db`);
      fs.exists = info.exists;
      fs.size = info.size ?? 0;
      fs.modificationTime = info.modificationTime ?? 0;
    } catch {
      // diagnostics only; never break the app
    }
  }
  return { ...fs, rows: getTransactionCount(), base: base || '(no document directory)' };
}

export function getBalance() {
  const row = db.getFirstSync(
    `SELECT COALESCE(SUM(CASE WHEN type IN ('Cash-in', 'Receive') THEN amount ELSE -amount END), 0) AS balance FROM transactions;`,
  );
  return row.balance;
}

function mapTx(row) {
  const kindMap = { Send: 'sent', Receive: 'received', Bill: 'bills', Load: 'load', 'Cash-in': 'received' };
  const kind = kindMap[row.type] ?? 'sent';
  const icons = { sent: 'send', received: 'arrow-down-left', bills: 'zap', load: 'smartphone' };
  return {
    id: String(row.id),
    title: row.type === 'Send' ? 'Transfer' : row.type === 'Receive' ? 'Payment Received' : row.type === 'Bill' ? row.recipient : 'Load Purchase',
    sub: row.recipient ? `${row.recipient} · ${new Date(row.timestamp).toLocaleString('en-PH')}` : new Date(row.timestamp).toLocaleString('en-PH'),
    amount: row.type === 'Send' || row.type === 'Bill' || row.type === 'Load' ? -row.amount : row.amount,
    kind,
    icon: icons[kind] ?? 'send',
    timestamp: row.timestamp,
  };
}

export function getTransactions(search = '') {
  const q = search.trim();
  let rows;
  if (q === '') {
    rows = db.getAllSync('SELECT * FROM transactions ORDER BY timestamp DESC;');
  } else {
    rows = db.getAllSync(
      'SELECT * FROM transactions WHERE recipient LIKE ? OR type LIKE ? ORDER BY timestamp DESC;',
      [`%${q}%`, `%${q}%`],
    );
  }
  return rows.map(mapTx);
}

// Throws on invalid input or insufficient balance. Returns the new balance.
export function addTransaction(type, amount, recipient) {
  const name = String(recipient ?? '').trim();
  const value = Number(amount);
  if (name.length < 3) throw new Error('Enter a recipient name.');
  if (!Number.isFinite(value) || value <= 0) throw new Error('Enter an amount greater than ₱0.');
  if (OUTGOING_TYPES.includes(type) && value > getBalance()) {
    throw new Error('Insufficient balance.');
  }
  db.runSync(
    'INSERT INTO transactions (type, amount, recipient, timestamp) VALUES (?, ?, ?, ?);',
    [type, value, name, new Date().toISOString()],
  );
  checkpoint();
  return getBalance();
}

export function deleteTransaction(id) {
  db.runSync('DELETE FROM transactions WHERE id = ?;', [id]);
  checkpoint();
}

export function addTransactionToDb(tx) {
  const type = tx.kind === 'sent' ? 'Send' : tx.kind === 'received' ? 'Receive' : 'Bill';
  const amount = Math.abs(tx.amount);
  const recipient = tx.sub?.split('·')[0]?.trim() ?? '';
  const timestamp = tx.timestamp ?? new Date().toISOString();
  // Returns the real SQLite rowid so later deletes match the table.
  const result = db.runSync(
    'INSERT INTO transactions (type, amount, recipient, timestamp) VALUES (?, ?, ?, ?);',
    [type, amount, recipient, timestamp],
  );
  checkpoint();
  return result.lastInsertRowId;
}

export function deleteTransactionFromDb(id) {
  db.runSync('DELETE FROM transactions WHERE id = ?;', [id]);
  checkpoint();
}

export function getAppState() {
  const row = db.getFirstSync(`SELECT value AS value FROM app_state WHERE key = 'store';`);
  return row ? row.value : null;
}

export function saveAppState(json) {
  db.runSync(
    `INSERT INTO app_state (key, value) VALUES ('store', ?)
     ON CONFLICT(key) DO UPDATE SET value = excluded.value;`,
    [json],
  );
  checkpoint();
}

// Back-compat wrappers used by the lab screens.
export function createSendTransaction({ recipient, amount }) {
  return addTransaction('Send', amount, recipient);
}

export const initDB = initDatabase;

export function formatPeso(n) {
  return `₱${Number(n).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
