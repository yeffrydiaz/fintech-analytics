import { NextRequest, NextResponse } from 'next/server';

const demoTransactions = [
  { id: '1', type: 'BUY', symbol: 'AAPL', quantity: 10, price: 185.50, totalAmount: 1855, fees: 1, executedAt: new Date('2024-01-15').toISOString() },
  { id: '2', type: 'BUY', symbol: 'MSFT', quantity: 5, price: 410.20, totalAmount: 2051, fees: 1, executedAt: new Date('2024-01-20').toISOString() },
  { id: '3', type: 'SELL', symbol: 'GOOGL', quantity: 2, price: 172.30, totalAmount: 344.60, fees: 1, executedAt: new Date('2024-02-01').toISOString() },
];

export async function GET() {
  return NextResponse.json({ transactions: demoTransactions });
}

export async function POST(request: NextRequest) {
  const body = await request.json() as Record<string, unknown>;
  
  const newTransaction = {
    id: Date.now().toString(),
    ...body,
    executedAt: new Date().toISOString(),
  };
  
  return NextResponse.json({ transaction: newTransaction }, { status: 201 });
}
