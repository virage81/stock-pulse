import config from '@/core/config';
import { Stock } from '@/types/stock';
import axios, { AxiosInstance } from 'axios';

export class ApiClient {
	protected server: AxiosInstance;

	constructor() {
		this.server = axios.create({
			baseURL: config.core.apiUri,
		});
	}

	async getStockList(symbol: string = 'AAPL,MSFT'): Promise<Stock[]> {
		try {
			const { data } = await this.server.get('/stocks', { params: { symbol } });
			return data;
		} catch (error) {
			throw error;
		}
	}
}
