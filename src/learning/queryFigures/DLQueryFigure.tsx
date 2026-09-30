import type { ComponentProps } from 'react'

import { DL } from '../notation'
import { RAQueryFigure } from './RAQueryFigure'

type Props = ComponentProps<typeof RAQueryFigure>

export function DLQueryFigure({ Component = DL, ...rest }: Props) {
	return <RAQueryFigure {...rest} Component={Component} />
}
