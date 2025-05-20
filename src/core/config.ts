class Config {
	get core() {
		return {
			apiUri: process.env.NEXT_PUBLIC_API_URL,
		};
	}

	get github() {
		return {
			link: process.env.NEXT_PUBLIC_GITHUB_PROFILE_URL,
		};
	}

	get twelveData() {
		const defaultSymbols = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'NVDA', 'META', 'TSLA', 'JPM'];
		return {
			apiUri: process.env.NEXT_PUBLIC_TWELVE_DATA_API_URL,
			webSocketApiUri: process.env.NEXT_PUBLIC_TWELVE_DATA_WEBSOCKET_API_URL,
			apiKey: process.env.NEXT_PUBLIC_TWELVE_DATA_API_KEY,
			defaultSymbols,
		};
	}
}

const config = new Config();

export default config;
