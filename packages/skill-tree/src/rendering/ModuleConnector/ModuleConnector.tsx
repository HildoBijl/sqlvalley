import { Curve } from '@step-wise/drawing'

import type { ModuleConnector as ModuleConnectorData } from '../../positioning'

import { useModuleConnectorStyle } from './useModuleConnectorStyle'

interface ModuleConnectorProps {
	connector: ModuleConnectorData
}

// Render the connection between two modules.
export function ModuleConnector({ connector }: ModuleConnectorProps) {
	const { strokeColor, strokeWidth, opacity } = useModuleConnectorStyle(connector)
	return <Curve
		positions={connector.points}
		stroke={strokeColor}
		strokeWidth={strokeWidth}
		smoothing={{ mode: 'around', distance: 20 }}
		style={{ opacity }}
	/>
}
