export interface TaxTransaction {
  id: string;
  type: 'BUY' | 'SELL' | 'DIVIDEND' | 'SPLIT';
  symbol: string;
  quantity: number;
  price: number;
  fees: number;
  executedAt: Date;
}

export interface TaxLot {
  quantity: number;
  costBasis: number;
  purchaseDate: Date;
}

export interface RealizedGain {
  symbol: string;
  saleDate: Date;
  quantity: number;
  proceeds: number;
  costBasis: number;
  gain: number;
  isLongTerm: boolean;
}

export interface TaxReportSummary {
  taxYear: number;
  realizedGains: RealizedGain[];
  totalShortTermGains: number;
  totalShortTermLosses: number;
  totalLongTermGains: number;
  totalLongTermLosses: number;
  totalGains: number;
  totalLosses: number;
  netGainLoss: number;
}

// Long-term holding requires MORE than 365 days (i.e., at least 366 days)
// Holdings must be held for more than 365 days (at least 366 days) to qualify as long-term
const LONG_TERM_THRESHOLD_MS = 366 * 24 * 60 * 60 * 1000;

export function isLongTermHolding(purchaseDate: Date, saleDate: Date): boolean {
  return saleDate.getTime() - purchaseDate.getTime() >= LONG_TERM_THRESHOLD_MS;
}

export function calculateRealizedGains(
  transactions: TaxTransaction[],
  taxYear: number
): TaxReportSummary {
  const lots: Map<string, TaxLot[]> = new Map();
  const realizedGains: RealizedGain[] = [];

  const sorted = [...transactions].sort(
    (a, b) => a.executedAt.getTime() - b.executedAt.getTime()
  );

  for (const tx of sorted) {
    if (tx.type === 'BUY') {
      const existingLots = lots.get(tx.symbol) || [];
      // costBasisPerShare: total cost (price × qty + fees) divided by qty
      const costBasisPerShare = (tx.price * tx.quantity + tx.fees) / tx.quantity;
      existingLots.push({
        quantity: tx.quantity,
        costBasis: costBasisPerShare,
        purchaseDate: tx.executedAt,
      });
      lots.set(tx.symbol, existingLots);
    } else if (tx.type === 'SELL') {
      const saleYear = tx.executedAt.getFullYear();
      let remainingQty = tx.quantity;
      const symbolLots = lots.get(tx.symbol) || [];
      const proceeds = tx.price * tx.quantity - tx.fees;

      while (remainingQty > 0 && symbolLots.length > 0) {
        const lot = symbolLots[0];

        if (lot.quantity <= remainingQty) {
          const lotProceeds = (proceeds / tx.quantity) * lot.quantity;
          const lotCostBasis = lot.costBasis * lot.quantity;
          const gain = lotProceeds - lotCostBasis;
          const longTerm = isLongTermHolding(lot.purchaseDate, tx.executedAt);

          if (saleYear === taxYear) {
            realizedGains.push({
              symbol: tx.symbol,
              saleDate: tx.executedAt,
              quantity: lot.quantity,
              proceeds: lotProceeds,
              costBasis: lotCostBasis,
              gain,
              isLongTerm: longTerm,
            });
          }

          remainingQty -= lot.quantity;
          symbolLots.shift();
        } else {
          const lotProceeds = (proceeds / tx.quantity) * remainingQty;
          const lotCostBasis = lot.costBasis * remainingQty;
          const gain = lotProceeds - lotCostBasis;
          const longTerm = isLongTermHolding(lot.purchaseDate, tx.executedAt);

          if (saleYear === taxYear) {
            realizedGains.push({
              symbol: tx.symbol,
              saleDate: tx.executedAt,
              quantity: remainingQty,
              proceeds: lotProceeds,
              costBasis: lotCostBasis,
              gain,
              isLongTerm: longTerm,
            });
          }

          lot.quantity -= remainingQty;
          remainingQty = 0;
        }
      }

      lots.set(tx.symbol, symbolLots);
    }
  }

  let totalShortTermGains = 0;
  let totalShortTermLosses = 0;
  let totalLongTermGains = 0;
  let totalLongTermLosses = 0;

  for (const rg of realizedGains) {
    if (rg.isLongTerm) {
      if (rg.gain > 0) totalLongTermGains += rg.gain;
      else totalLongTermLosses += Math.abs(rg.gain);
    } else {
      if (rg.gain > 0) totalShortTermGains += rg.gain;
      else totalShortTermLosses += Math.abs(rg.gain);
    }
  }

  const totalGains = totalShortTermGains + totalLongTermGains;
  const totalLosses = totalShortTermLosses + totalLongTermLosses;
  const netGainLoss = totalGains - totalLosses;

  return {
    taxYear,
    realizedGains,
    totalShortTermGains,
    totalShortTermLosses,
    totalLongTermGains,
    totalLongTermLosses,
    totalGains,
    totalLosses,
    netGainLoss,
  };
}
