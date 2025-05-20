'use client';
import config from '@/core/config';
import { GitHub } from '@mui/icons-material';
import { Box, Container, IconButton, useTheme } from '@mui/material';

export const Footer = () => {
	const theme = useTheme();

	return (
		<Box component='footer' sx={{ p: '10px 5px', bgcolor: theme.palette.grey[200] }}>
			<Container maxWidth='xl' sx={{ display: 'flex', placeItems: 'center' }}>
				<IconButton aria-label='github-link' href={config.github.link} target='_blank' sx={{ m: '0 auto' }}>
					<GitHub sx={{ color: theme.palette.common.black }} />
				</IconButton>
			</Container>
		</Box>
	);
};
