import axios, { AxiosInstance } from 'axios';

import { StockConverter } from '@/converters/stock.converter';
import config from '@/core/config';
import { Stock, StockDto, StockDtoRecord } from '@/types/stock';

export interface StockPriceUpdate {
	symbol: string;
	price: number;
}

interface ErrorResponse {
	code: number;
	message: string;
	status: 'ok' | 'error';
}

type ApiResponse<T = unknown> = T | ErrorResponse;

const isErrorResponse = (data: ApiResponse): data is ErrorResponse => {
	return (data as ErrorResponse).status === 'error';
};

class TwelveDataApi {
	private ws: WebSocket | null = null;
	protected server: AxiosInstance;
	private symbols: string[] = config.twelveData.defaultSymbols.slice(0, 4);

	constructor() {
		this.server = axios.create({
			baseURL: config.twelveData.apiUri,
			headers: {
				Authorization: `apikey ${config.twelveData.apiKey}`,
			},
		});
	}

	private createWebsocket() {
		this.ws = new WebSocket(`${config.twelveData.webSocketApiUri}quotes/price?apikey=${config.twelveData.apiKey}`);
	}

	async getApiUsage() {
		try {
			const { data } = await this.server.get('/api_usage');
			if (isErrorResponse(data)) throw new Error(data.message);
			return data;
		} catch (e) {
			if (e instanceof Error) {
				throw new Error('Internal Server Error', { cause: e });
			}

			throw e;
		}
	}

	async getStockList(symbols?: string): Promise<Stock[]> {
		try {
			const { data } = await this.server.get<ApiResponse<StockDto | StockDtoRecord>>('/time_series', {
				params: {
					symbol: symbols ?? this.symbols.join(','),
					interval: '1day',
					outputsize: 1,
				},
			});

			if (isErrorResponse(data)) throw new Error(data.message);

			const stockConverter = new StockConverter();
			const hasSymbolKey = this.symbols.some(s => Object.hasOwn(data, s));
			if (hasSymbolKey) {
				const stocks = Object.values(data).reduce((acc, item) => {
					const stock = stockConverter.convertDto(item);
					acc.push(stock);
					return acc;
				}, [] as Stock[]);
				return stocks;
			}

			const stock = stockConverter.convertDto(data as StockDto);
			return [stock];
		} catch (error) {
			console.error('Error getting stock list:', error);
			return [];
		}
	}

	subscribeToPrices(symbols: string, onPriceUpdate: (update: StockPriceUpdate) => void): () => void {
		this.createWebsocket();
		if (!this.ws) throw new Error('Websocket not initialized!');

		this.ws.addEventListener('open', event => {
			this.ws?.send(JSON.stringify({ action: 'subscribe', params: { symbols } }));
		});

		this.ws.onmessage = event => {
			const data = JSON.parse(event.data.toString());
			if (data.event === 'authenticate') {
				this.ws?.send(JSON.stringify({ apikey: config.twelveData.apiKey }));
			}
			if (data.event === 'price' && data.symbol && data.price) {
				onPriceUpdate({
					symbol: data.symbol,
					price: parseFloat(data.price),
				});
			}
		};

		this.ws.onerror = error => {
			console.error('WebSocket error:', error);
		};

		this.ws.onclose = () => {
			console.log('WebSocket closed');
		};

		return () => {
			if (this.ws) {
				this.ws.send(JSON.stringify({ action: 'unsubscribe', params: { symbols } }));
				this.ws.close();
				this.ws = null;
			}
		};
	}
}

export const twelveDataClientApi = new TwelveDataApi();
