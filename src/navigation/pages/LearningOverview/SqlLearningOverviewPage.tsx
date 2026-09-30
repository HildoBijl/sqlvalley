import { sqlModulePositions, sqlConnectors } from '@/curriculum'
import { SkillTreeOverviewPage } from '../SkillTreeOverviewPage';

/*
 * LearningOverviewPage component that displays the skill tree overview page.
 */
export default function LearningOverviewPage() {
	return (
		<SkillTreeOverviewPage
			treeId="sql"
			modulePositions={sqlModulePositions}
			visiblePaths={sqlConnectors}
		/>
	);
}
