import { useEffect } from 'react';
import { useTimeout } from './useTimeout';

export function useDebounce(callback: () => void, delay: number, deps: unknown[]) {
	const { reset, clear } = useTimeout(callback, delay);

	useEffect(reset, [...deps, reset]);
	useEffect(clear, [clear]);
}
