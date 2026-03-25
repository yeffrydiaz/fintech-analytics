import PortfolioOverview from '@/components/dashboard/PortfolioOverview';
import PerformanceChart from '@/components/dashboard/PerformanceChart';
import AssetAllocation from '@/components/dashboard/AssetAllocation';
import TransactionList from '@/components/dashboard/TransactionList';
import TaxReportSection from '@/components/dashboard/TaxReportSection';
import { calculatePortfolioMetrics, generatePerformanceHistory } from '@/lib/portfolio';

const demoAssets = [
  { symbol: 'AAPL', name: 'Apple Inc.', quantity: 50, averageCost: 150, currentPrice: 189.5, assetType: 'STOCK' },
  { symbol: 'MSFT', name: 'Microsoft Corp.', quantity: 30, averageCost: 280, currentPrice: 415.2, assetType: 'STOCK' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', quantity: 10, averageCost: 120, currentPrice: 175.8, assetType: 'STOCK' },
  { symbol: 'BTC', name: 'Bitcoin', quantity: 0.5, averageCost: 35000, currentPrice: 67000, assetType: 'CRYPTO' },
  { symbol: 'VTI', name: 'Vanguard Total Market ETF', quantity: 100, averageCost: 200, currentPrice: 245.3, assetType: 'ETF' },
];

const demoTransactions = [
  { id: '1', type: 'BUY' as const, symbol: 'AAPL', quantity: 10, price: 185.50, totalAmount: 1855, fees: 1, executedAt: new Date('2024-01-15') },
  { id: '2', type: 'BUY' as const, symbol: 'MSFT', quantity: 5, price: 410.20, totalAmount: 2051, fees: 1, executedAt: new Date('2024-01-20') },
  { id: '3', type: 'SELL' as const, symbol: 'GOOGL', quantity: 2, price: 172.30, totalAmount: 344.60, fees: 1, executedAt: new Date('2024-02-01') },
  { id: '4', type: 'BUY' as const, symbol: 'BTC', quantity: 0.1, price: 65000, totalAmount: 6500, fees: 15, executedAt: new Date('2024-02-10') },
  { id: '5', type: 'DIVIDEND' as const, symbol: 'VTI', quantity: 0, price: 0, totalAmount: 125.50, fees: 0, executedAt: new Date('2024-03-01') },
];

export default function DashboardPage() {
  const metrics = calculatePortfolioMetrics(demoAssets);
  const performanceHistory = generatePerformanceHistory(metrics.totalValue);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Portfolio Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">Welcome back! Here&apos;s your portfolio overview.</p>
      </div>

      <PortfolioOverview metrics={metrics} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <PerformanceChart data={performanceHistory} />
        </div>
        <div>
          <AssetAllocation assets={metrics.assets} />
        </div>
      </div>

      <TransactionList transactions={demoTransactions} />

      <TaxReportSection />
    </div>
  );
}
