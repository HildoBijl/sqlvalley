import {
  datalogModulePositions,
  datalogConnectors,
} from "@/curriculum/definitions/datalog-treeDefinitions";
import { SkillTreeOverviewPage } from "../SkillTreeOverviewPage";

/*
 * Datalog-LearningOverviewPage component that displays the skill tree overview page.
 */
export default function DatalogLearningOverviewPage() {
  return (
    <SkillTreeOverviewPage
      treeId="datalog"
      modulePositions={datalogModulePositions}
      visiblePaths={datalogConnectors}
    />
  );
}
