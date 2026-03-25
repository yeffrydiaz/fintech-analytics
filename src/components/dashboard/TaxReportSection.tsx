'use client';

import { useState } from 'react';
import { calculateRealizedGains, TaxTransaction } from '@/lib/taxReport';

const demoTaxTransactions: TaxTransaction[] = [
  { id: '1', type: 'BUY', symbol: 'AAPL', quantity: 100, price: 130, fees: 1, executedAt: new Date('2022-03-01') },
  { id: '2', type: 'SELL', symbol: 'AAPL', quantity: 50, price: 175, fees: 1, executedAt: new Date('2023-08-15') },
  { id: '3', type: 'BUY', symbol: 'MSFT', quantity: 20, price: 250, fees: 1, executedAt: new Date('2022-06-01') },
  { id: '4', type: 'SELL', symbol: 'MSFT', quantity: 10, price: 380, fees: 1, executedAt: new Date('2023-11-20') },
  { id: '5', type: 'BUY', symbol: 'GOOGL', quantity: 15, price: 100, fees: 1, executedAt: new Date('2023-01-10') },
  { id: '6', type: 'SELL', symbol: 'GOOGL', quantity: 5, price: 140, fees: 1, executedAt: new Date('2023-09-05') },
];

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(value);
}

export default function TaxReportSection() {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear - 1);
  const [report, setReport] = useState<ReturnType<typeof calculateRealizedGains> | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const result = calculateRealizedGains(demoTaxTransactions, selectedYear);
      setReport(result);
      setIsGenerating(false);
    }, 800);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">Tax Report Generation</h2>
      
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div>
          <label htmlFor="tax-year" className="block text-sm font-medium text-gray-700 mb-1">
            Tax Year
          </label>
          <select
            id="tax-year"
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="block w-32 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
          >
            {years.map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
        <div className="flex items-end">
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isGenerating ? 'Generating...' : 'Generate Report'}
          </button>
        </div>
      </div>

      {report && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-green-50 rounded-lg p-4">
              <div className="text-xs text-green-600 font-medium uppercase tracking-wide">Short-Term Gains</div>
              <div className="mt-1 text-lg font-bold text-green-700">{formatCurrency(report.totalShortTermGains)}</div>
            </div>
            <div className="bg-red-50 rounded-lg p-4">
              <div className="text-xs text-red-600 font-medium uppercase tracking-wide">Short-Term Losses</div>
              <div className="mt-1 text-lg font-bold text-red-700">-{formatCurrency(report.totalShortTermLosses)}</div>
            </div>
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="text-xs text-blue-600 font-medium uppercase tracking-wide">Long-Term Gains</div>
              <div className="mt-1 text-lg font-bold text-blue-700">{formatCurrency(report.totalLongTermGains)}</div>
            </div>
            <div className={`rounded-lg p-4 ${report.netGainLoss >= 0 ? 'bg-green-50' : 'bg-red-50'}`}>
              <div className={`text-xs font-medium uppercase tracking-wide ${report.netGainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>Net Gain/Loss</div>
              <div className={`mt-1 text-lg font-bold ${report.netGainLoss >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                {formatCurrency(report.netGainLoss)}
              </div>
            </div>
          </div>

          {report.realizedGains.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">Realized Gains/Losses Breakdown</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                  <thead>
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Symbol</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Term</th>
                      <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase">Proceeds</th>
                      <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase">Cost Basis</th>
                      <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase">Gain/Loss</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {report.realizedGains.map((gain, i) => (
                      <tr key={i} className="hover:bg-gray-50">
                        <td className="px-3 py-2 font-medium text-gray-900">{gain.symbol}</td>
                        <td className="px-3 py-2">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${gain.isLongTerm ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}`}>
                            {gain.isLongTerm ? 'Long-Term' : 'Short-Term'}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-right text-gray-600">{formatCurrency(gain.proceeds)}</td>
                        <td className="px-3 py-2 text-right text-gray-600">{formatCurrency(gain.costBasis)}</td>
                        <td className={`px-3 py-2 text-right font-medium ${gain.gain >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {gain.gain >= 0 ? '+' : ''}{formatCurrency(gain.gain)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {report.realizedGains.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No realized gains/losses found for {selectedYear}.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
