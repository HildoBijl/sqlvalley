import type { CSSProperties } from 'react'

import { type HtmlElementProps, HtmlElement } from '@step-wise/drawing'

import databaseSource from './Database.svg'
import serverSource from './Server.svg'
import userSource from './User.svg'

const glyphSources = {
	Database: databaseSource,
	Server: serverSource,
	User: userSource,
}

export interface GlyphProps extends HtmlElementProps {
	name: keyof typeof glyphSources
	width?: number
	height?: number
	elementStyle?: CSSProperties
}

export function Glyph({ name, width = 100, height, style, elementStyle, ...props }: GlyphProps) {
	return <HtmlElement ignoreMouse behind style={elementStyle} {...props}>
		<img src={glyphSources[name]} width={width} height={height} style={style} />
	</HtmlElement>
}
