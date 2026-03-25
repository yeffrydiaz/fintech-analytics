import { calculateRealizedGains, isLongTermHolding } from '@/lib/taxReport';

describe('Tax Report Generation', () => {
  describe('isLongTermHolding', () => {
    it('should return true for holdings over 1 year', () => {
      const purchaseDate = new Date('2022-01-01');
      const saleDate = new Date('2023-02-01');
      expect(isLongTermHolding(purchaseDate, saleDate)).toBe(true);
    });

    it('should return false for holdings under 1 year', () => {
      const purchaseDate = new Date('2023-01-01');
      const saleDate = new Date('2023-06-01');
      expect(isLongTermHolding(purchaseDate, saleDate)).toBe(false);
    });

    it('should return false for holdings exactly 364 days', () => {
      const purchaseDate = new Date('2023-01-01');
      const saleDate = new Date('2023-12-31');
      expect(isLongTermHolding(purchaseDate, saleDate)).toBe(false);
    });
  });

  describe('calculateRealizedGains', () => {
    const sampleTransactions = [
      { id: '1', type: 'BUY' as const, symbol: 'AAPL', quantity: 100, price: 100, fees: 0, executedAt: new Date('2022-01-01') },
      { id: '2', type: 'SELL' as const, symbol: 'AAPL', quantity: 50, price: 150, fees: 0, executedAt: new Date('2023-06-01') },
      { id: '3', type: 'BUY' as const, symbol: 'MSFT', quantity: 10, price: 200, fees: 5, executedAt: new Date('2023-01-01') },
      { id: '4', type: 'SELL' as const, symbol: 'MSFT', quantity: 5, price: 280, fees: 2, executedAt: new Date('2023-09-01') },
    ];

    it('should calculate AAPL long-term gains correctly', () => {
      const report = calculateRealizedGains(sampleTransactions, 2023);
      const aaplGain = report.realizedGains.find((g) => g.symbol === 'AAPL');
      expect(aaplGain).toBeDefined();
      expect(aaplGain?.isLongTerm).toBe(true);
      expect(aaplGain?.gain).toBeCloseTo(2500, 0);
    });

    it('should calculate net gain/loss correctly', () => {
      const report = calculateRealizedGains(sampleTransactions, 2023);
      expect(report.netGainLoss).toBe(report.totalGains - report.totalLosses);
    });

    it('should return empty for a year with no transactions', () => {
      const report = calculateRealizedGains(sampleTransactions, 2021);
      expect(report.realizedGains).toHaveLength(0);
      expect(report.netGainLoss).toBe(0);
    });

    it('should use FIFO cost basis method', () => {
      const transactions = [
        { id: '1', type: 'BUY' as const, symbol: 'TEST', quantity: 10, price: 100, fees: 0, executedAt: new Date('2022-01-01') },
        { id: '2', type: 'BUY' as const, symbol: 'TEST', quantity: 10, price: 200, fees: 0, executedAt: new Date('2022-06-01') },
        { id: '3', type: 'SELL' as const, symbol: 'TEST', quantity: 10, price: 150, fees: 0, executedAt: new Date('2023-01-01') },
      ];
      const report = calculateRealizedGains(transactions, 2023);
      const gain = report.realizedGains.find((g) => g.symbol === 'TEST');
      expect(gain?.gain).toBeCloseTo(500, 0);
    });
  });
});
