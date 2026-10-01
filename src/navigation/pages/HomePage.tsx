import { Box, Button, Container, Link, Typography } from '@mui/material'
import { Map as MapIcon } from '@mui/icons-material'
import { Link as RouterLink } from 'react-router-dom'

export function HomePage() {
	return <>
		<Box component="section" aria-labelledby="home-title" sx={{
			bgcolor: 'primary.main',
			color: 'primary.contrastText',
		}}>
			<Container maxWidth={false} sx={{
				maxWidth: 1040,
				display: 'grid',
				gridTemplateColumns: { xs: '200px minmax(0, 1fr)', sm: '250px minmax(0, 1fr)', md: '300px minmax(0, 1fr)' },
				gap: { xs: 3, sm: 3, md: 6 },
				alignItems: 'center',
				py: { xs: 3.5, sm: 5, md: 7 },
			}}>
				<Box component="h1" id="home-title" aria-label="SQL Valley" sx={{
					m: 0,
					width: { xs: 200, sm: '100%' },
					aspectRatio: '2 / 1',
					gridColumn: { xs: '1 / -1', sm: 1 },
					justifySelf: { xs: 'center', sm: 'stretch' },
					bgcolor: 'primary.contrastText',
					mask: 'url(/SQLValleyTitle.svg) center / contain no-repeat',
					WebkitMask: 'url(/SQLValleyTitle.svg) center / contain no-repeat',
				}} />
				<Box sx={{ minWidth: 0, gridColumn: { xs: '1 / -1', sm: 2 } }}>
					<Typography sx={{ fontSize: { xs: 18, md: 22 }, lineHeight: 1.6, fontWeight: 500 }}>
						Build practical SQL skills at your own pace, from database fundamentals to advanced queries.
					</Typography>
					<Box component="ul" sx={{ pl: 2.5, my: 2.5, '& li': { pl: 0.5, mb: 0.75 }, '& li:last-child': { mb: 0 } }}>
						<li><Typography component="span">Clear explanations that introduce each new idea.</Typography></li>
						<li><Typography component="span">Hands-on exercises with immediate feedback.</Typography></li>
						<li><Typography component="span">A structured skill tree that remembers your progress.</Typography></li>
					</Box>
					<Button component={RouterLink} to="/learn" variant="contained" startIcon={<MapIcon />} sx={{ bgcolor: 'primary.contrastText', color: 'primary.main', fontSize: 16, px: 2.5, py: 1.1, my: 1, '&:hover': { bgcolor: 'primary.contrastText', filter: 'brightness(0.94)' } }}>
						Open the skill tree
					</Button>
				</Box>
			</Container>
		</Box>

		<Container maxWidth={false} sx={{ maxWidth: 1040, pb: 4, '& a:focus-visible': { outline: '2px solid', outlineColor: 'text.primary', outlineOffset: 3 } }}>
			<Box component="footer" sx={{ mt: { xs: 4, md: 6 }, pt: 2, borderTop: '1px solid', borderColor: 'divider', '& h2': { fontSize: 16, fontWeight: 500, mb: 1 }, '& p': { fontSize: 14, lineHeight: 1.6, color: 'text.secondary' } }}>
				<Box sx={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: 2.5, '@media (min-width: 700px)': { gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1.25fr)' } }}>
					<Box>
						<Typography component="h2">About SQL Valley</Typography>
						<Typography>
							Developed by the Database Group at Eindhoven University of Technology
							for database courses 2ID50 and JBI050.
						</Typography>
					</Box>
					<Box>
						<Typography component="h2">Contact</Typography>
						<Typography sx={{ mb: 0.5 }}>Hildo Bijl · <Link href="mailto:h.j.bijl@tue.nl" color="inherit" underline="always">h.j.bijl@tue.nl</Link></Typography>
						<Typography>Nick Yakovets · <Link href="mailto:n.yakovets@tue.nl" color="inherit" underline="always">n.yakovets@tue.nl</Link></Typography>
					</Box>
					<Box>
						<Typography component="h2">Development team</Typography>
						<Box component="dl" sx={{ m: 0, fontSize: 14, lineHeight: 1.6, '& > div': { display: 'flex', flexWrap: 'wrap', columnGap: 0.75, mb: 0.5 }, '& dt': { color: 'text.primary' }, '& dd': { m: 0, color: 'text.secondary' } }}>
							<div><dt>Strahil Peykov</dt><dd>· Educational Programmer</dd></div>
							<div><dt>Alexandra Boala</dt><dd>· Skill Tree Developer</dd></div>
							<div><dt>Razvan Efros</dt><dd>· Storyline Designer</dd></div>
						</Box>
					</Box>
				</Box>
				<Typography sx={{ mt: 2 }}>© {new Date().getFullYear()} Eindhoven University of Technology</Typography>
			</Box>
		</Container>
	</>
}
