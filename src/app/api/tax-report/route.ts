import { NextRequest, NextResponse } from 'next/server';
import { calculateRealizedGains, TaxTransaction } from '@/lib/taxReport';

export async function POST(request: NextRequest) {
  const body = await request.json() as { taxYear: number; transactions: TaxTransaction[] };
  const { taxYear, transactions } = body;

  if (!taxYear || !transactions) {
    return NextResponse.json(
      { error: 'taxYear and transactions are required' },
      { status: 400 }
    );
  }

  const typedTransactions: TaxTransaction[] = transactions.map((tx) => ({
    ...tx,
    executedAt: new Date(tx.executedAt),
  }));

  const report = calculateRealizedGains(typedTransactions, taxYear);

  return NextResponse.json({ report });
}
