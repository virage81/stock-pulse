import { Container } from '@mui/material';
import Typography from '@mui/material/Typography';

export default async function Stock({ params }: { params: Promise<{ symbol: string }> }) {
	const { symbol } = await params;

	return (
		<Container maxWidth='xl' component='section'>
			<Typography variant='h5' component='h4'>
				Stock: {symbol}
			</Typography>
			<Typography variant='body1'>Stock details will be displayed here.</Typography>
		</Container>
	);
}
