import { createBrowserRouter } from 'react-router-dom'

import { Layout } from './layout'
import { HomePage, SkillTreeOverviewPage, ModulePage, NotFoundPage, RouteErrorPage } from './pages'
import { learningRoutes } from './paths'

// Define all the paths that are available on the site.
export const router = createBrowserRouter([{
	path: '/',
	element: <Layout />,
	errorElement: <RouteErrorPage />,
	children: [
		{ index: true, element: <HomePage /> },
		...learningRoutes.map(route => ({ path: route.path, element: <SkillTreeOverviewPage treeId={route.id} /> })),
		{ path: 'module/:moduleId', element: <ModulePage /> },
		{ path: '*', element: <NotFoundPage /> },
	],
}])
