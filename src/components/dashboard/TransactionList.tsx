import { format } from 'date-fns';

interface Transaction {
  id: string;
  type: 'BUY' | 'SELL' | 'DIVIDEND' | 'SPLIT';
  symbol: string;
  quantity: number;
  price: number;
  totalAmount: number;
  fees: number;
  executedAt: Date;
}

interface Props {
  transactions: Transaction[];
}

const typeColors = {
  BUY: 'bg-green-100 text-green-800',
  SELL: 'bg-red-100 text-red-800',
  DIVIDEND: 'bg-blue-100 text-blue-800',
  SPLIT: 'bg-purple-100 text-purple-800',
};

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(value);
}

export default function TransactionList({ transactions }: Props) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">Recent Transactions</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Symbol</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {transactions.map((tx) => (
              <tr key={tx.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm text-gray-600">
                  {format(new Date(tx.executedAt), 'MMM d, yyyy')}
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${typeColors[tx.type]}`}>
                    {tx.type}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm font-medium text-gray-900">{tx.symbol}</td>
                <td className="px-4 py-3 text-sm text-gray-600 text-right">
                  {tx.type === 'DIVIDEND' ? '—' : tx.quantity.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600 text-right">
                  {tx.type === 'DIVIDEND' ? '—' : formatCurrency(tx.price)}
                </td>
                <td className="px-4 py-3 text-sm font-medium text-gray-900 text-right">
                  {formatCurrency(tx.totalAmount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
