import { useEffect } from 'react'
import { createBrowserRouter } from 'react-router-dom'

import { Layout } from './layout'
import { HomePage, SkillTreeOverviewPage, ConceptPage, SkillPage, NotFoundPage, RouteErrorPage } from './pages'
import { learningRoutes } from './paths'

export const router = createBrowserRouter([{
	path: '/',
	element: <Layout />,
	errorElement: <RouteErrorPage />,
	children: [
		{ index: true, element: <HomePage /> },
		...learningRoutes.map(route => ({ path: route.path, element: <SkillTreeOverviewPage treeId={route.id} /> })),
		{ path: 'concept/:conceptId', element: <ConceptPage /> },
		{ path: 'skill/:skillId', element: <SkillPage /> },
		{ path: 'survey', element: <ExternalRedirect to="https://forms.cloud.microsoft/e/ceJ8eGQ8CG" /> },
		{ path: '*', element: <NotFoundPage /> },
	],
}])

function ExternalRedirect({ to }: { to: string }) {
	useEffect(() => { window.location.replace(to) }, [to])
	return <div>Redirecting...</div>
}
