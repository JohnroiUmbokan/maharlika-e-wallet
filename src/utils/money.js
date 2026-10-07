import { z } from 'zod';

// All money math in integer centavos. Never floats.
export const TRANSFER_FEE_CENTAVOS = 300; // ₱3.00

export function toCentavos(pesos) {
  return Math.round(Number(pesos) * 100);
}

export function fromCentavos(centavos) {
  return centavos / 100;
}

const php = new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' });

export function formatCentavos(centavos) {
  return php.format(fromCentavos(centavos));
}

// Signed display: red outgoing (−₱), green incoming (+₱)
export function formatSignedCentavos(centavos) {
  const sign = centavos < 0 ? '−' : '+';
  return `${sign}${php.format(Math.abs(fromCentavos(centavos)))}`;
}

export function maskAccount(acc) {
  const digits = String(acc ?? '').replace(/[^0-9]/g, '');
  if (digits.length <= 4) return digits;
  return `•••• ${digits.slice(-4)}`;
}

const recipientSchema = z.string().trim().min(3, 'Enter a name, number, or account.');
const amountSchema = z.number().positive('Enter an amount greater than ₱0.');

export function validateTransfer({ recipient, amountCentavos, balanceCentavos }) {
  const r = recipientSchema.safeParse(recipient);
  if (!r.success) return { ok: false, error: r.error.issues[0].message };
  const a = amountSchema.safeParse(fromCentavos(amountCentavos));
  if (!a.success) return { ok: false, error: a.error.issues[0].message };
  if (amountCentavos + TRANSFER_FEE_CENTAVOS > balanceCentavos) {
    return { ok: false, error: 'Amount plus ₱3.00 fee exceeds your balance.' };
  }
  return { ok: true, error: null };
}

export const billSchema = z.object({
  billerId: z.string().min(1, 'Choose a biller.'),
  accountNo: z.string().regex(/^\d{6,}$/, 'Enter a valid account number.'),
  amountCentavos: z.number().int().positive('Enter an amount greater than ₱0.'),
});

export function validateBillPayment({ billerId, accountNo, amountCentavos, balanceCentavos }) {
  const parsed = billSchema.safeParse({ billerId, accountNo, amountCentavos });
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };
  if (amountCentavos > balanceCentavos) return { ok: false, error: 'Insufficient balance. Top up first.' };
  return { ok: true, error: null };
}

// Pure balance math for tests: deduct amount + fee, append transaction.
export function applyTransfer({ balanceCentavos, amountCentavos, feeCentavos = TRANSFER_FEE_CENTAVOS }) {
  if (amountCentavos <= 0) throw new Error('Amount must be positive');
  if (amountCentavos + feeCentavos > balanceCentavos) throw new Error('Insufficient balance');
  return balanceCentavos - amountCentavos - feeCentavos;
}
