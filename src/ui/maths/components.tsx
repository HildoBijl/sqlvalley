import { InlineMath, BlockMath } from 'react-katex'

import 'katex/dist/katex.min.css'

import './style.css'

export interface MathProps {
	children: string
	className?: string
}

export interface InlineMathProps extends MathProps {
	suffix?: string
}

export function M({ children, className, suffix }: InlineMathProps) {
	const math = <InlineMath className={className}>
		{children}
	</InlineMath>

	if (suffix) return <span style={{ whiteSpace: 'nowrap' }}>
		{math}{suffix}
	</span>

	return math
}

export function BM({ children, className }: MathProps) {
	return <BlockMath className={className}>
		{children}
	</BlockMath>
}
