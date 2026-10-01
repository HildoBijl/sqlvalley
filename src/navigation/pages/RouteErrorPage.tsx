import { Container, Typography, Button } from '@mui/material'
import { Link } from 'react-router-dom'

export function RouteErrorPage({ message = 'Something went wrong' }: { message?: string }) {
	return <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
		<Typography variant="h4" component="h1" gutterBottom>{message}</Typography>
		<Button component={Link} to="/">Return to Home</Button>
	</Container>
}
