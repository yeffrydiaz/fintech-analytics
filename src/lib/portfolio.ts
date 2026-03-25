export interface AssetData {
  symbol: string;
  name: string;
  quantity: number;
  averageCost: number;
  currentPrice: number;
  assetType: string;
}

export interface PortfolioMetrics {
  totalValue: number;
  totalCostBasis: number;
  totalPnL: number;
  totalPnLPercentage: number;
  assets: AssetAllocation[];
}

export interface AssetAllocation {
  symbol: string;
  name: string;
  value: number;
  percentage: number;
  pnl: number;
  pnlPercentage: number;
  assetType: string;
}

export interface PerformanceDataPoint {
  date: string;
  value: number;
}

export function calculatePortfolioMetrics(assets: AssetData[]): PortfolioMetrics {
  const totalValue = assets.reduce(
    (sum, asset) => sum + asset.quantity * asset.currentPrice,
    0
  );

  const totalCostBasis = assets.reduce(
    (sum, asset) => sum + asset.quantity * asset.averageCost,
    0
  );

  const totalPnL = totalValue - totalCostBasis;
  const totalPnLPercentage = totalCostBasis > 0 ? (totalPnL / totalCostBasis) * 100 : 0;

  const assetAllocations: AssetAllocation[] = assets.map((asset) => {
    const value = asset.quantity * asset.currentPrice;
    const costBasis = asset.quantity * asset.averageCost;
    const pnl = value - costBasis;
    const pnlPercentage = costBasis > 0 ? (pnl / costBasis) * 100 : 0;
    const percentage = totalValue > 0 ? (value / totalValue) * 100 : 0;

    return {
      symbol: asset.symbol,
      name: asset.name,
      value,
      percentage,
      pnl,
      pnlPercentage,
      assetType: asset.assetType,
    };
  });

  return {
    totalValue,
    totalCostBasis,
    totalPnL,
    totalPnLPercentage,
    assets: assetAllocations,
  };
}

export function generatePerformanceHistory(
  currentValue: number,
  months: number = 12
): PerformanceDataPoint[] {
  const history: PerformanceDataPoint[] = [];
  const now = new Date();

  for (let i = months - 1; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const randomFactor = 0.85 + Math.random() * 0.3;
    const trendFactor = 1 + ((months - i) / months) * 0.15;
    const value = currentValue * randomFactor * trendFactor * (1 - (months - i) * 0.01);

    history.push({
      date: date.toISOString().split('T')[0],
      value: Math.round(value * 100) / 100,
    });
  }

  history.push({
    date: now.toISOString().split('T')[0],
    value: currentValue,
  });

  return history;
}

export function getTopPerformer(assets: AssetAllocation[]): AssetAllocation | null {
  if (assets.length === 0) return null;
  return assets.reduce((top, asset) =>
    asset.pnlPercentage > top.pnlPercentage ? asset : top
  );
}
