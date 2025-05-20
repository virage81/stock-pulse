import { twelveDataClientApi } from '@/api/twelvedata';
import { NextResponse } from 'next/server';

export async function GET() {
	try {
		const data = await twelveDataClientApi.getApiUsage();

		return NextResponse.json(data);
	} catch (error) {
		if (error instanceof Error) {
			return NextResponse.json({ message: error.message, details: error }, { status: 500 });
		}
		return NextResponse.json({ message: error, details: error }, { status: 500 });
	}
}
