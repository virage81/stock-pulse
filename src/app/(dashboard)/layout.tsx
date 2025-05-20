'use client';
import { StockProvider } from '@/api/context';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { Box } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export default function DashboardLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<QueryClientProvider client={queryClient}>
			<StockProvider>
				<Header />
				<Box component='main' sx={{ py: 2.5, mt: `var(--header-height)`, flex: 1 }}>
					{children}
				</Box>
				<Footer />
			</StockProvider>
		</QueryClientProvider>
	);
}
