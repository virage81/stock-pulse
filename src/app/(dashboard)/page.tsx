import { StockList } from '@/components/StockList';
import { Container } from '@mui/material';

export default function Dashboard() {
	return (
		<Container maxWidth='lg' component='section'>
			<StockList />
		</Container>
	);
}
