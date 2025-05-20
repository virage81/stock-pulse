'use client';
import { createTheme } from '@mui/material/styles';
import { Geist } from 'next/font/google';

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
});

const theme = createTheme({
	typography: {
		fontFamily: geistSans.style.fontFamily,
	},
});

export default theme;
