export const numberFormat = (value: number, options?: Intl.NumberFormatOptions) => {
	const formatter = Intl.NumberFormat('en-us', {
		maximumFractionDigits: 2,
		currencySign: 'standard',
		...options,
	});

	return formatter.format(value);
};
