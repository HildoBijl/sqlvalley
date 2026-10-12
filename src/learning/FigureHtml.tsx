import type { ComponentProps } from 'react'

import { HtmlElement } from '@step-wise/drawing'

export function FigureHtml({ ignoreMouse = false, style, ...props }: ComponentProps<typeof HtmlElement>) {
	return <HtmlElement {...props} ignoreMouse={ignoreMouse} style={{ whiteSpace: 'normal', width: 'max-content', ...style }} />
}
