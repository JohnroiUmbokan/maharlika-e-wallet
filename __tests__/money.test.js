import { applyTransfer, formatCentavos, formatSignedCentavos, toCentavos, validateBillPayment, validateTransfer } from '../src/utils/money';

describe('money formatting (en-PH, PHP)', () => {
  it('formats centavos as PHP', () => {
    expect(formatCentavos(543218)).toMatch(/₱5,432\.18/);
  });

  it('signs outgoing red-style and incoming green-style amounts', () => {
    expect(formatSignedCentavos(-50000)).toMatch(/^−/);
    expect(formatSignedCentavos(100000)).toMatch(/^\+/);
  });
});

describe('transfer validation', () => {
  const balance = toCentavos(5432.18);

  it('requires a recipient', () => {
    expect(validateTransfer({ recipient: '', amountCentavos: 10000, balanceCentavos: balance }).ok).toBe(false);
  });

  it('requires amount > 0', () => {
    expect(validateTransfer({ recipient: 'Maria', amountCentavos: 0, balanceCentavos: balance }).ok).toBe(false);
  });

  it('rejects amount + fee above balance', () => {
    expect(validateTransfer({ recipient: 'Maria', amountCentavos: balance, balanceCentavos: balance }).ok).toBe(false);
  });

  it('accepts a valid transfer inside balance', () => {
    expect(validateTransfer({ recipient: 'Maria Santos', amountCentavos: 50000, balanceCentavos: balance }).ok).toBe(true);
  });
});

describe('balance math (integer centavos)', () => {
  it('deducts amount plus ₱3.00 fee', () => {
    expect(applyTransfer({ balanceCentavos: 543218, amountCentavos: 50000 })).toBe(543218 - 50000 - 300);
  });

  it('throws on insufficient balance', () => {
    expect(() => applyTransfer({ balanceCentavos: 1000, amountCentavos: 1000 })).toThrow('Insufficient balance');
  });
});

describe('bill validation', () => {
  it('rejects short account numbers', () => {
    expect(
      validateBillPayment({ billerId: 'b1', accountNo: '123', amountCentavos: 100, balanceCentavos: 100000 }).ok,
    ).toBe(false);
  });
});
