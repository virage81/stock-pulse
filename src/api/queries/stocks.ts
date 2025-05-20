import { useQuery } from '@tanstack/react-query';
import { ApiClient } from '../client';

export const useStocksQuery = (symbols: string) => {
	const apiClient = new ApiClient();

	return useQuery({
		queryKey: ['stocks', symbols],
		queryFn: () => apiClient.getStockList(symbols),
		staleTime: 1000 * 60 * 2, // 2 minutes,
	});
};
