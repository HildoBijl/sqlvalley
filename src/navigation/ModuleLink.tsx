import type { ReactNode } from 'react'

import { Link } from '@/ui'
import { type ModuleId, modulePresentation } from '@/curriculum'

import { getModulePath } from './paths'

export type ModuleLinkProps = {
	moduleId: ModuleId
	children?: ReactNode
}

export function ModuleLink({ moduleId, children }: ModuleLinkProps) {
	return <Link to={getModulePath(moduleId)}>{children ?? modulePresentation[moduleId].name}</Link>
}
