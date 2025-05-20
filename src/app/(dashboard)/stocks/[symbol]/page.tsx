import { Container } from '@mui/material';
import Typography from '@mui/material/Typography';

export default function Stock({ params }: { params: { symbol: string } }) {
	const { symbol } = params;

	return (
		<Container maxWidth='xl' component='section'>
			<Typography variant='h5' component='h4'>
				Stock: {symbol}
			</Typography>
			<Typography variant='body1'>Stock details will be displayed here.</Typography>
		</Container>
	);
}
