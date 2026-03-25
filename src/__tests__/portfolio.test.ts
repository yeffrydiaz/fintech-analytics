import { calculatePortfolioMetrics, generatePerformanceHistory, getTopPerformer } from '@/lib/portfolio';

const mockAssets = [
  { symbol: 'AAPL', name: 'Apple', quantity: 10, averageCost: 150, currentPrice: 200, assetType: 'STOCK' },
  { symbol: 'MSFT', name: 'Microsoft', quantity: 5, averageCost: 300, currentPrice: 350, assetType: 'STOCK' },
  { symbol: 'GOOGL', name: 'Alphabet', quantity: 2, averageCost: 100, currentPrice: 90, assetType: 'STOCK' },
];

describe('Portfolio calculations', () => {
  describe('calculatePortfolioMetrics', () => {
    it('should calculate total portfolio value correctly', () => {
      const metrics = calculatePortfolioMetrics(mockAssets);
      expect(metrics.totalValue).toBe(3930);
    });

    it('should calculate total cost basis correctly', () => {
      const metrics = calculatePortfolioMetrics(mockAssets);
      expect(metrics.totalCostBasis).toBe(3200);
    });

    it('should calculate total P&L correctly', () => {
      const metrics = calculatePortfolioMetrics(mockAssets);
      expect(metrics.totalPnL).toBe(730);
    });

    it('should calculate P&L percentage correctly', () => {
      const metrics = calculatePortfolioMetrics(mockAssets);
      expect(metrics.totalPnLPercentage).toBeCloseTo(22.8125, 2);
    });

    it('should calculate asset allocation percentages', () => {
      const metrics = calculatePortfolioMetrics(mockAssets);
      const totalPercentage = metrics.assets.reduce((sum, a) => sum + a.percentage, 0);
      expect(totalPercentage).toBeCloseTo(100, 5);
    });

    it('should handle empty assets array', () => {
      const metrics = calculatePortfolioMetrics([]);
      expect(metrics.totalValue).toBe(0);
      expect(metrics.totalCostBasis).toBe(0);
      expect(metrics.totalPnL).toBe(0);
      expect(metrics.totalPnLPercentage).toBe(0);
    });
  });

  describe('generatePerformanceHistory', () => {
    it('should generate the correct number of data points', () => {
      const history = generatePerformanceHistory(100000, 12);
      expect(history.length).toBe(13);
    });

    it('should end with the current value', () => {
      const currentValue = 150000;
      const history = generatePerformanceHistory(currentValue, 12);
      expect(history[history.length - 1].value).toBe(currentValue);
    });

    it('should have valid date strings', () => {
      const history = generatePerformanceHistory(100000, 6);
      history.forEach((point) => {
        expect(point.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      });
    });
  });

  describe('getTopPerformer', () => {
    it('should return the asset with highest P&L percentage', () => {
      const metrics = calculatePortfolioMetrics(mockAssets);
      const top = getTopPerformer(metrics.assets);
      expect(top?.symbol).toBe('AAPL');
    });

    it('should return null for empty assets', () => {
      expect(getTopPerformer([])).toBeNull();
    });
  });
});
