'use client';
import { useStocksQuery } from '@/api/queries/stocks';
import { StockPriceUpdate, twelveDataClientApi } from '@/api/twelvedata';
import { StockConverter } from '@/converters/stock.converter';
import config from '@/core/config';
import { Stock } from '@/types/stock';
import { numberFormat } from '@/utils';
import { ArrowDownward, ArrowUpward, Cancel, Filter, FilterList, Search } from '@mui/icons-material';
import {
	Box,
	FormControl,
	Input,
	InputAdornment,
	InputLabel,
	Link,
	MenuItem,
	Select,
	SelectChangeEvent,
	Stack,
	Toolbar,
	Typography,
} from '@mui/material';
import { DataGrid, GridColDef, QuickFilter, QuickFilterClear, QuickFilterControl } from '@mui/x-data-grid';
import { useQueryClient } from '@tanstack/react-query';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';

const UPDATE_INTERVAL = 5000;
const stockConverter = new StockConverter();

const symbols = config.twelveData.defaultSymbols.slice(0, 8);

const columns: GridColDef[] = [
	{
		field: 'symbol',
		headerName: 'Symbol',
		flex: 2,
		renderCell(params) {
			return <Link href={`/stocks/${(params.value as string).toLocaleLowerCase()}`}>{params.value}</Link>;
		},
	},
	{
		field: 'price',
		headerName: 'Price',
		headerAlign: 'center',
		align: 'center',
		flex: 1,
		renderCell(params) {
			return (
				<Typography sx={{ fontSize: 'inherit', lineHeight: 'inherit' }}>
					{numberFormat(params.value, {
						currency: params.row.currency,
						style: 'currency',
					})}
				</Typography>
			);
		},
	},
	{
		field: 'priceChange',
		headerName: 'change (1 day)',
		headerAlign: 'right',
		align: 'right',
		flex: 1,
		renderCell(params) {
			const isPriceGrow = params.value > 0;
			return (
				<Box
					display='flex'
					alignItems='center'
					justifyContent='inherit'
					sx={{ fontSize: 'inherit', lineHeight: 'inherit' }}>
					{isPriceGrow ? (
						<ArrowUpward fontSize='small' color='success' sx={{ mr: 0.5 }} />
					) : (
						<ArrowDownward fontSize='small' color='error' sx={{ mr: 0.5 }} />
					)}
					<Typography color={isPriceGrow ? 'success' : 'error'} sx={{ fontSize: 'inherit', lineHeight: 'inherit' }}>
						{numberFormat(params.value, {
							currency: params.row.currency,
							style: 'currency',
						})}
					</Typography>
				</Box>
			);
		},
	},
] as const;

type Filter = 'grow' | 'fall' | 'all';

export const StockList = () => {
	const searchParams = useSearchParams();
	const { replace } = useRouter();
	const pathName = usePathname();

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

	const handleChangeFilter = (filter: Filter) => {
		setFilter(filter);
		const params = new URLSearchParams(searchParams);

		params.set('filter', filter);
		replace(`${pathName}?${params.toString()}`);
	};

	useEffect(() => {
		setFilter(searchParams.get('filter') as Filter);
	}, [searchParams]);

	useEffect(() => {
		const lastUpdate = Date.now();

		const unsubscribe = twelveDataClientApi.subscribeToPrices(symbols.join(','), update =>
			onPriceUpdate(lastUpdate, update),
		);

		return () => unsubscribe();
	}, [symbols]);

	return (
		<Box>
			<Typography variant='h4' component='h4' sx={{ textAlign: 'center', pb: 5 }}>
				Stocks
			</Typography>
			<DataGrid
				slots={{
					toolbar: () => <CustomToolbar filter={filter} handleChangeFilter={handleChangeFilter} />,
				}}
				showToolbar
				estimatedRowCount={8}
				loading={isLoading}
				columns={columns}
				rows={filteredData}
				disableAutosize={true}
				disableColumnFilter={true}
				disableColumnMenu={true}
				disableColumnSorting={true}
				disableColumnSelector={true}
				disableDensitySelector={true}
			/>
		</Box>
	);
};

type CustomToolbarProps = {
	filter: Filter;
	handleChangeFilter: (filter: Filter) => void;
};
const CustomToolbar = ({ filter, handleChangeFilter }: CustomToolbarProps) => {
	const handleChange = (e: SelectChangeEvent) => {
		handleChangeFilter(e.target.value as Filter);
	};

	return (
		<Toolbar sx={{ width: '100%', px: 0, m: '0 auto' }}>
			<QuickFilter debounceMs={500} style={{ width: '100%' }}>
				<QuickFilterControl
					fullWidth
					render={({ ref, ...controlProps }, state) => {
						return (
							<Stack direction={'row'} gap={5} justifyContent='space-between' width='100%' aria-label='STACK'>
								<Input
									{...controlProps}
									fullWidth
									sx={{ maxWidth: 300 }}
									inputRef={ref}
									aria-label='Search'
									placeholder='Search...'
									size='small'
									startAdornment={
										<InputAdornment position='start'>
											<Search fontSize='small' />
										</InputAdornment>
									}
									endAdornment={
										<>
											{state.value ? (
												<InputAdornment position='end'>
													<QuickFilterClear
														edge='end'
														size='small'
														aria-label='Clear search'
														material={{ sx: { marginRight: -0.75 } }}>
														<Cancel fontSize='small' />
													</QuickFilterClear>
												</InputAdornment>
											) : null}
										</>
									}
								/>

								<FormControl>
									<InputLabel id='only_grow'>Filter:</InputLabel>
									<Select
										size='small'
										startAdornment={<FilterList />}
										labelId='only_grow'
										id='only_grow'
										name='only_grow'
										value={filter}
										onChange={handleChange}>
										<MenuItem value={'grow'}>Show Growing Stocks</MenuItem>
										<MenuItem value={'fall'}>Show Falling Stocks</MenuItem>
										<MenuItem value={'all'}>Show all stock</MenuItem>
									</Select>
								</FormControl>
							</Stack>
						);
					}}
				/>
			</QuickFilter>
		</Toolbar>
	);
};
