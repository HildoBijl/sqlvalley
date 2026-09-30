declare module 'react-katex' {
	import type { FC, ReactNode } from 'react'

	export interface KaTeXProps {
		children: string
		className?: string
		errorColor?: string
		renderError?: (error: Error) => ReactNode
	}

	export const InlineMath: FC<KaTeXProps>
	export const BlockMath: FC<KaTeXProps>
}
