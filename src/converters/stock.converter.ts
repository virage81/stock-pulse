import { Stock, StockDataGrid, StockDto } from '@/types/stock';
import { numberFormat } from '@/utils';

export class StockConverter {
	public stock: Stock | null = null;

	constructor() {}

	public convertDto(data: StockDto) {
		const convertedStock = {
			symbol: data.meta?.symbol,
			currency: data.meta.currency,
			price: numberFormat(parseFloat(data.values[0].close)),
			close: numberFormat(parseFloat(data.values[0].close)),
			open: numberFormat(parseFloat(data.values[0].open)),
		};

		this.stock = convertedStock;
		return this.stock;
	}

	public calculatePriceChange(stock: Stock): number {
		const formattedPrice = numberFormat(parseFloat(stock.open) - parseFloat(stock.price));
		return parseFloat(formattedPrice);
	}

	public convertToDataGrid(data: Stock[]): StockDataGrid[] {
		return data.reduce((acc, item) => {
			const priceChange = this.calculatePriceChange(item);
			acc.push({
				id: item.symbol,
				priceChange,
				...item,
			});
			return acc;
		}, [] as StockDataGrid[]);
	}

	public updatePrice(data: Stock): StockDataGrid {
		const priceChange = this.calculatePriceChange(data);
		return {
			id: data.symbol,
			priceChange,
			...data,
		};
	}
}
