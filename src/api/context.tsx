import { StockConverter } from '@/converters/stock.converter';
import config from '@/core/config';
import { Stock, StockDataGrid } from '@/types/stock';
import { useQueryClient } from '@tanstack/react-query';
import { createContext, PropsWithChildren, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useStocksQuery } from './queries/stocks';
import { StockPriceUpdate, twelveDataClientApi } from './twelvedata';

export type Filter = 'grow' | 'fall' | 'all';

interface StockContext {
	stocks: StockDataGrid[];
	filter: Filter;
	setFilter: (filter: Filter) => void;
	isLoading: boolean;
}

const UPDATE_INTERVAL = 5000;
const symbols = config.twelveData.defaultSymbols.slice(0, 8);
const stockConverter = new StockConverter();

const StockContext = createContext<StockContext | undefined>(undefined);

export const StockProvider = ({ children }: PropsWithChildren) => {
	const queryClient = useQueryClient();
	const { data, isLoading } = useStocksQuery(symbols.join(','));

	const [filter, setFilter] = useState<Filter>('all');

	const filteredData = useMemo(() => {
		const convertedData = stockConverter.convertToDataGrid(data ?? []);

		if (filter === 'grow') {
			return convertedData.filter(stock => stock.price > stock.open);
		} else if (filter === 'fall') {
			return convertedData.filter(stock => stock.price <= stock.open);
		}

		return convertedData;
	}, [data, filter]);

	const onPriceUpdate = useCallback(
		(lastUpdate: number, update: StockPriceUpdate) => {
			const now = Date.now();

			if (now - lastUpdate >= UPDATE_INTERVAL) {
				queryClient.setQueryData(['stocks', symbols.join(',')], (oldData: Stock[]) => {
					if (!oldData) return oldData;
					return oldData.map(stock => (stock.symbol === update.symbol ? { ...stock, price: update.price } : stock));
				});
				lastUpdate = now;
			}
		},
		[symbols],
	);

	useEffect(() => {
		const lastUpdate = Date.now();

		const unsubscribe = twelveDataClientApi.subscribeToPrices(symbols.join(','), update =>
			onPriceUpdate(lastUpdate, update),
		);

		return () => unsubscribe();
	}, [symbols]);

	return (
		<StockContext.Provider value={{ stocks: filteredData, isLoading, filter, setFilter }}>
			{children}
		</StockContext.Provider>
	);
};

export function useStockContext() {
	const context = useContext(StockContext);
	if (!context) {
		throw new Error('useStockContext must be used within a StockProvider');
	}
	return context;
}
