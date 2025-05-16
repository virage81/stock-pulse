'use client';
import { Box, Container, Typography, useTheme } from '@mui/material';

export const Header = () => {
	const theme = useTheme();

	return (
		<Box
			component={'header'}
			sx={{
				position: 'fixed',
				inset: '0 0 auto',
				height: 'var(--header-height)',
				p: theme.spacing(1.25, 0.75),
				bgcolor: theme.palette.grey[200],
				display: 'flex',
				placeItems: 'center',
			}}>
			<Container maxWidth='xl'>
				<Typography
					variant='h6'
					component='h2'
					sx={{ textAlign: 'center', fontWeight: 'bold', color: 'text.primary', textTransform: 'uppercase' }}>
					Stock Pulse
				</Typography>
			</Container>
		</Box>
	);
};
