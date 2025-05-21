export const numberFormat = (value: number, options?: Intl.NumberFormatOptions): string => {
	const formatter = Intl.NumberFormat('en-us', {
		maximumFractionDigits: 2,
		currencySign: 'standard',
		...options,
	});

	return formatter.format(value);
};

export const formatAndConvertNumber = (value: string | number, options?: Intl.NumberFormatOptions): number => {
	const formatter = Intl.NumberFormat('en-us', {
		maximumFractionDigits: 2,
		useGrouping: false,
		...options,
	});

	if (typeof value === 'string') {
		return parseFloat(formatter.format(parseFloat(value)));
	} else return parseFloat(formatter.format(value));
};
