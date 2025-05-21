import { Stock, TechnicalIndicators } from '@/types/stock';

export class StockTechnicalIndicator {
	public stock: Stock;
	constructor(stock: Stock) {
		this.stock = {
			...stock,
			history: stock.history.sort((a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime()),
			rsi: null,
			macd: {
				macdLine: null,
				signalLine: null,
				histogram: null,
			},
		};
	}

	public calculateTechnicalIndicators(): Stock {
		this.stock.rsi = this.calculateRSI();
		this.stock.macd = this.calculateMACD();

		return this.stock;
	}

	public calculateRSI(period = 14): TechnicalIndicators['rsi'] {
		const { history } = this.stock;
		if (history.length < period + 1) return null;

		const closes = history.map(entry => parseFloat(entry.close));
		const gains: number[] = [];
		const losses: number[] = [];

		for (let i = 1; i < closes.length; i++) {
			const change = closes[i] - closes[i - 1];
			gains.push(change > 0 ? change : 0);
			losses.push(change < 0 ? Math.abs(change) : 0);
		}

		const recentGains = gains.slice(-period);
		const recentLosses = losses.slice(-period);

		const avgGain = this.calculateSMA(recentGains, period);
		const avgLoss = this.calculateSMA(recentLosses, period);

		if (avgGain === null || avgLoss === null) return null;

		if (avgLoss === 0) return 100;

		const rs = avgGain / avgLoss;
		const rsi = 100 - 100 / (1 + rs);
		return rsi;
	}

	public calculateMACD(shortPeriod = 12, longPeriod = 26, signalPeriod = 9): TechnicalIndicators['macd'] {
		const { history } = this.stock;
		if (history.length < longPeriod + signalPeriod) {
			return { macdLine: null, signalLine: null, histogram: null };
		}

		const closes = history.map(entry => parseFloat(entry.close)).reverse();
		const shortEMA = this.calculateEMA(closes, shortPeriod);
		const longEMA = this.calculateEMA(closes, longPeriod);

		if (shortEMA.length === 0 || longEMA.length === 0) {
			return { macdLine: null, signalLine: null, histogram: null };
		}

		const minLength = Math.min(shortEMA.length, longEMA.length);
		const macdLine = shortEMA.slice(-minLength).map((short, i) => short - longEMA[i]);
		const signalLine = this.calculateEMA(macdLine, signalPeriod);

		if (macdLine.length === 0 || signalLine.length === 0) {
			return { macdLine: null, signalLine: null, histogram: null };
		}

		const lastMacd = macdLine[macdLine.length - 1];
		const lastSignal = signalLine[signalLine.length - 1];

		return {
			macdLine: lastMacd,
			signalLine: lastSignal,
			histogram: lastMacd - lastSignal,
		};
	}

	public calculateSMA(data: number[], period: number): number {
		if (data.length < period) return 0;
		const sum = data.reduce((acc, val) => acc + val, 0);
		return sum / period;
	}

	public calculateEMA(data: number[], period: number): number[] {
		if (data.length < period) return [];
		const k = 2 / (period + 1);
		const ema: number[] = [];
		ema[0] = this.calculateSMA(data.slice(0, period), period);
		for (let i = period; i < data.length; i++) {
			ema.push(data[i] * k + ema[ema.length - 1] * (1 - k));
		}
		return ema;
	}
}
