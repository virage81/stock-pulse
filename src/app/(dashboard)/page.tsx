import { Container, Typography } from '@mui/material';

export default function Dashboard() {
	return (
		<Container maxWidth='xl' component='section'>
			<Typography variant='h4' component='h4' sx={{ textAlign: 'center' }}>
				Stocks will be displayed here
			</Typography>
		</Container>
	);
}
