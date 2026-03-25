import { NextResponse } from 'next/server';
import { calculatePortfolioMetrics, generatePerformanceHistory } from '@/lib/portfolio';

const demoAssets = [
  { symbol: 'AAPL', name: 'Apple Inc.', quantity: 50, averageCost: 150, currentPrice: 189.5, assetType: 'STOCK' },
  { symbol: 'MSFT', name: 'Microsoft Corp.', quantity: 30, averageCost: 280, currentPrice: 415.2, assetType: 'STOCK' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', quantity: 10, averageCost: 120, currentPrice: 175.8, assetType: 'STOCK' },
  { symbol: 'BTC', name: 'Bitcoin', quantity: 0.5, averageCost: 35000, currentPrice: 67000, assetType: 'CRYPTO' },
  { symbol: 'VTI', name: 'Vanguard Total Market ETF', quantity: 100, averageCost: 200, currentPrice: 245.3, assetType: 'ETF' },
];

export async function GET() {
  const metrics = calculatePortfolioMetrics(demoAssets);
  const performanceHistory = generatePerformanceHistory(metrics.totalValue);

  return NextResponse.json({
    metrics,
    performanceHistory,
    assets: demoAssets,
  });
}
