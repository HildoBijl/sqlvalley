import { Container, Typography, Button } from '@mui/material'
import { Link } from 'react-router-dom'

export function NotFoundPage({ message = '404 - Page not found' }: { message?: string }) {
	return <Container sx={{ py: 4, textAlign: 'center' }}>
		<Typography variant="h4" component="h1" gutterBottom>{message}</Typography>
		<Button component={Link} to="/">Return to Home</Button>
	</Container>
}
