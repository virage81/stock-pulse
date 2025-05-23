'use client';
import { Filter, useStockContext } from '@/api/context';
import { StockDataGrid, TechnicalIndicators } from '@/types/stock';
import { numberFormat } from '@/utils';
import { ArrowDownward, ArrowUpward, Cancel, FilterList, Search } from '@mui/icons-material';
import {
	Box,
	FormControl,
	Input,
	InputAdornment,
	InputLabel,
	MenuItem,
	Select,
	SelectChangeEvent,
	Stack,
	Toolbar,
	Typography,
} from '@mui/material';
import {
	DataGrid,
	GridCallbackDetails,
	GridColDef,
	GridRowSelectionModel,
	QuickFilter,
	QuickFilterClear,
	QuickFilterControl,
} from '@mui/x-data-grid';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { StockChart } from './StockChart';

const columns: GridColDef[] = [
	{
		field: 'symbol',
		headerName: 'Symbol',
		flex: 2,
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
		field: 'rsi',
		headerName: 'RSI (14)',
		headerAlign: 'center',
		align: 'center',
		flex: 1,
		renderCell(params) {
			return <Typography sx={{ fontSize: 'inherit', lineHeight: 'inherit' }}>{numberFormat(params.value)}</Typography>;
		},
	},
	{
		field: 'macd',
		headerName: 'MACD',
		headerAlign: 'center',
		align: 'center',
		flex: 1,
		renderCell(params) {
			return (
				<Typography sx={{ fontSize: 'inherit', lineHeight: 'inherit' }}>
					{numberFormat((params.value as TechnicalIndicators['macd']).macdLine ?? 0)}
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

export const StockList = () => {
	const searchParams = useSearchParams();
	const { replace } = useRouter();
	const pathName = usePathname();

	const { stocks, filter, setFilter, isLoading } = useStockContext();

	const [selectedStock, setSelectedStock] = useState<StockDataGrid | null>(null);

	const handleChangeFilter = (filter: Filter) => {
		setFilter(filter);
		const params = new URLSearchParams(searchParams);

		params.set('filter', filter);
		replace(`${pathName}?${params.toString()}`);
	};

	const handleRowClick = (rowSelectionModel: GridRowSelectionModel, details: GridCallbackDetails) => {
		if (!rowSelectionModel.ids.size) {
			setSelectedStock(null);
			return;
		}

		const selectedStockId = Array.from(rowSelectionModel.ids)[0] as string;
		const selectedStock = stocks.find(stock => stock.symbol.toLowerCase() === selectedStockId.toLowerCase());

		if (selectedStock) setSelectedStock(selectedStock);
	};

	useEffect(() => {
		setFilter(searchParams.get('filter') as Filter);
	}, [searchParams]);

	return (
		<Stack spacing={3}>
			<Box>
				<Typography variant='h4' component='h4' sx={{ textAlign: 'center', pb: 5 }}>
					Stocks
				</Typography>
				<DataGrid
					slots={{
						toolbar: () => <CustomToolbar filter={filter} handleChangeFilter={handleChangeFilter} />,
					}}
					showToolbar
					loading={isLoading}
					columns={columns}
					rows={stocks}
					disableAutosize
					disableColumnFilter
					disableColumnMenu
					disableColumnSorting
					disableColumnSelector
					disableDensitySelector
					onRowSelectionModelChange={handleRowClick}
				/>
			</Box>
			{selectedStock && <StockChart stock={selectedStock} />}
		</Stack>
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
