export interface StockDtoRecord {
	[symbol: string]: StockDto;
}

export interface StockDto {
	meta: StockDtoMeta;
	values: StockDtoValue[];
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

interface StockDtoValue {
	datetime: string;
	open: string;
	high: string;
	low: string;
	close: string;
	volume: string;
}

export interface Stock {
	symbol: string;
	currency: string;
	price: string;
	open: string;
	close: string;
}

export interface StockDataGrid extends Stock {
	id: string;
	priceChange: number;
}
