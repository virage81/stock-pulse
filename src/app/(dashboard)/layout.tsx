import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { Box } from '@mui/material';

export default function DashboardLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<>
			<Header />
			<Box component='main' sx={{ py: 2.5, mt: `var(--header-height)`, flex: 1 }}>
				{children}
			</Box>
			<Footer />
		</>
	);
}
