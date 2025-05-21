'use client';
import { StockDataGrid } from '@/types/stock';
import { formatAndConvertNumber, numberFormat } from '@/utils';
import { Stack, Typography } from '@mui/material';
import {
	AllSeriesType,
	ChartContainer,
	ChartsAxisHighlight,
	ChartsTooltip,
	ChartsXAxis,
	ChartsYAxis,
	LineHighlightPlot,
	LinePlot,
} from '@mui/x-charts';
import { BarPlot } from '@mui/x-charts/BarChart';
import { useMemo } from 'react';

type Props = {
	stock: StockDataGrid;
};

export const StockChart = ({ stock }: Props) => {
	const dates = useMemo(() => stock.history.map(item => new Date(item.datetime)), [stock]);
	const series = useMemo(() => {
		return [
			{
				type: 'bar',
				yAxisId: 'volume',
				label: 'Volume',
				color: '#757575',
				data: stock.history.map(item => formatAndConvertNumber(item.volume)),
				highlightScope: { highlight: 'item' },
			},
			{
				type: 'line',
				yAxisId: 'price',
				color: 'red',
				label: 'Low',
				data: stock.history.map(item => formatAndConvertNumber(item.low)),
				highlightScope: { highlight: 'item' },
			},
			{
				type: 'line',
				yAxisId: 'price',
				color: 'green',
				label: 'High',
				data: stock.history.map(item => formatAndConvertNumber(item.high)),
			},
		] as AllSeriesType[];
	}, [stock.history]);

	return (
		<Stack spacing={1}>
			<Typography variant='h6' textAlign='center' textTransform='capitalize'>
				{stock.symbol} Stock History
			</Typography>

			<ChartContainer
				series={series}
				height={400}
				xAxis={[
					{
						id: 'date',
						data: dates,
						scaleType: 'band',
						valueFormatter: value => value.toLocaleDateString(),
						height: 40,
					},
				]}
				yAxis={[
					{
						id: 'price',
						scaleType: 'linear',
						position: 'left',
						width: 50,
						valueFormatter: value => numberFormat(value, { compactDisplay: 'short', notation: 'compact' }),
					},
					{
						id: 'volume',
						scaleType: 'linear',
						position: 'right',
						valueFormatter: value => numberFormat(value, { compactDisplay: 'short', notation: 'compact' }),
						width: 55,
					},
				]}>
				<ChartsAxisHighlight x='line' y='line' />
				<BarPlot />
				<LinePlot />

				<LineHighlightPlot />
				<ChartsXAxis
					label='Date'
					axisId='date'
					tickLabelStyle={{
						fontSize: 10,
					}}
				/>
				<ChartsYAxis label='Price (USD)' axisId='price' tickLabelStyle={{ fontSize: 10 }} />
				<ChartsYAxis label='Volume' axisId='volume' tickLabelStyle={{ fontSize: 10 }} />
				<ChartsTooltip />
			</ChartContainer>
		</Stack>
	);
};
