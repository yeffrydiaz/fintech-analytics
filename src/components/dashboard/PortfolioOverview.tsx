import { PortfolioMetrics, getTopPerformer } from '@/lib/portfolio';

interface Props {
  metrics: PortfolioMetrics;
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(value);
}

function formatPercentage(value: number): string {
  return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
}

export default function PortfolioOverview({ metrics }: Props) {
  const topPerformer = getTopPerformer(metrics.assets);

  const cards = [
    {
      title: 'Total Portfolio Value',
      value: formatCurrency(metrics.totalValue),
      subtitle: 'Current market value',
      color: 'blue',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      title: 'Total P&L',
      value: formatCurrency(metrics.totalPnL),
      subtitle: formatPercentage(metrics.totalPnLPercentage),
      color: metrics.totalPnL >= 0 ? 'green' : 'red',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
    },
    {
      title: 'Total Assets',
      value: metrics.assets.length.toString(),
      subtitle: 'Positions held',
      color: 'purple',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
    },
    {
      title: 'Top Performer',
      value: topPerformer ? topPerformer.symbol : 'N/A',
      subtitle: topPerformer ? formatPercentage(topPerformer.pnlPercentage) : '',
      color: 'yellow',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      ),
    },
  ];

  const colorMap = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    red: 'bg-red-50 text-red-600',
    purple: 'bg-purple-50 text-purple-600',
    yellow: 'bg-yellow-50 text-yellow-600',
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card) => (
        <div key={card.title} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className={`p-2 rounded-lg ${colorMap[card.color as keyof typeof colorMap]}`}>
              {card.icon}
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900">{card.value}</div>
          <div className="mt-1 text-sm text-gray-500">{card.title}</div>
          {card.subtitle && (
            <div className={`mt-1 text-sm font-medium ${
              card.subtitle.startsWith('+') ? 'text-green-600' : 
              card.subtitle.startsWith('-') ? 'text-red-600' : 'text-gray-500'
            }`}>
              {card.subtitle}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
