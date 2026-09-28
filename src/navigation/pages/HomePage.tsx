import { Box, Button, Container, Link, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'

export default function HomePage() {
	return <Container maxWidth="lg" sx={{ pt: { xs: 4, md: 5 }, pb: 4, '& a:focus-visible': { outline: '2px solid', outlineColor: 'text.primary', outlineOffset: 3 } }}>
		<Box component="section" aria-labelledby="home-title" sx={{ maxWidth: 680 }}>
			<Box component="h1" id="home-title" sx={{ m: 0, mb: 3 }}>
				<Box component="span" role="img" aria-label="SQL Valley" sx={{
					display: 'block',
					width: { xs: 200, sm: 240 },
					height: { xs: 100, sm: 120 },
					bgcolor: theme => theme.palette.mode === 'dark' ? theme.palette.text.primary : theme.palette.primary.main,
					mask: 'url(/SQLValleyTitle.svg) center / contain no-repeat',
					WebkitMask: 'url(/SQLValleyTitle.svg) center / contain no-repeat',
				}} />
			</Box>
			<Typography sx={{ fontSize: 18, lineHeight: 1.7, mb: 2 }}>
				SQL Valley combines explanations of database concepts with SQL exercises.
				Write and run queries in your browser, then submit your answer for feedback.
			</Typography>
			<Typography sx={{ fontSize: 16, lineHeight: 1.7, color: 'text.secondary', mb: 3 }}>
				Use the skill tree to choose a topic. It shows how topics connect,
				what you’ve completed, and which skills you can work on next.
			</Typography>
			<Button component={RouterLink} to="/learn" variant="contained" sx={{ fontSize: 16, px: 2.5, py: 1.25 }}>
				Open the skill tree
			</Button>
			<Typography sx={{ fontSize: 16, lineHeight: 1.7, mt: 2.5 }}>
				New to databases? <Link component={RouterLink} to="/concept/database?tab=theory" color="inherit" underline="always">Read the introduction</Link>.
			</Typography>
			<Typography sx={{ fontSize: 14, lineHeight: 1.7, color: 'text.secondary', mt: 3 }}>
				No installation needed. Your progress is saved in this browser.
			</Typography>
		</Box>

		<Box component="footer" sx={{ mt: 5, pt: 3, borderTop: '1px solid', borderColor: 'divider', '& h2': { fontSize: 16, fontWeight: 500, mb: 1.5 }, '& p': { fontSize: 14, lineHeight: 1.7, color: 'text.secondary' } }}>
			<Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'minmax(0, 1fr)', sm: 'repeat(2, minmax(0, 1fr))', md: 'repeat(3, minmax(0, 1fr))' }, gap: { xs: 3, md: 5 } }}>
				<Box>
					<Typography component="h2">About SQL Valley</Typography>
					<Typography>
						Developed by the Database Group at Eindhoven University of Technology
						for database courses 2ID50 and JBI050.
					</Typography>
				</Box>
				<Box>
					<Typography component="h2">Contact</Typography>
					<Typography>Hildo Bijl</Typography>
					<Link href="mailto:h.j.bijl@tue.nl" color="inherit" underline="always" sx={{ display: 'inline-block', fontSize: 14, py: 0.5, mb: 1 }}>h.j.bijl@tue.nl</Link>
					<Typography>Nick Yakovets</Typography>
					<Link href="mailto:n.yakovets@tue.nl" color="inherit" underline="always" sx={{ display: 'inline-block', fontSize: 14, py: 0.5 }}>n.yakovets@tue.nl</Link>
				</Box>
				<Box>
					<Typography component="h2">Development team</Typography>
					<Box component="dl" sx={{ m: 0, fontSize: 14, lineHeight: 1.7, '& dt': { color: 'text.primary' }, '& dd': { m: 0, mb: 1, color: 'text.secondary' } }}>
						<dt>Strahil Peykov</dt><dd>Educational Programmer</dd>
						<dt>Alexandra Boala</dt><dd>Skill Tree Developer</dd>
						<dt>Razvan Efros</dt><dd>Storyline Designer</dd>
					</Box>
				</Box>
			</Box>
			<Typography sx={{ mt: 3 }}>© {new Date().getFullYear()} Eindhoven University of Technology</Typography>
		</Box>
	</Container>
}
