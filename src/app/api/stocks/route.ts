import { twelveDataClientApi } from '@/api/twelvedata';
import config from '@/core/config';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
	const params = req.nextUrl.searchParams;

	const symbol = params.get('symbol') ?? config.twelveData.defaultSymbols.slice(0, 8).join(',');

	try {
		const stocks = await twelveDataClientApi.getStockList(symbol);

		return NextResponse.json(stocks);
	} catch (error) {
		if (error instanceof Error) {
			return NextResponse.json({ message: error.message, details: error }, { status: 500 });
		}
		return NextResponse.json({ message: error, details: error }, { status: 500 });
	}
}
