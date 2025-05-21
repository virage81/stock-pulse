export interface StockDtoRecord {
	[symbol: string]: StockDto;
}

export interface StockDto {
	meta: StockDtoMeta;
	values: StockDtoHistory[];
}

interface StockDtoMeta {
	symbol: string;
	interval: string;
	currency: string;
	exchange_timezone: string;
	exchange: string;
	mic_code: string;
	type: string;
}

interface StockDtoHistory {
	datetime: string;
	open: string;
	high: string;
	low: string;
	close: string;
	volume: string;
}

export interface TechnicalIndicators {
	rsi: number | null;
	macd: {
		macdLine: number | null;
		signalLine: number | null;
		histogram: number | null;
	};
}

export interface Stock extends TechnicalIndicators {
	symbol: string;
	currency: string;
	price: string;
	open: string;
	close: string;
	history: StockHistory[];
}

export interface StockHistory {
	datetime: string;
	open: string;
	high: string;
	low: string;
	close: string;
	volume: string;
}

export interface StockDataGrid extends Stock {
	id: string;
	priceChange: number;
}

export interface StockChart extends Pick<Stock, 'symbol' | 'currency'> {
	open: number[];
	close: number[];
	rsi: number[];
}
