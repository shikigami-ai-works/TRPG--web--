import ScenarioExplorer from "@/components/ScenarioExplorer";
import { loadScenarioPacks } from "@/lib/scenarios/loader";

export default async function DebugPage() {
  const packs = await loadScenarioPacks();
  return <ScenarioExplorer packs={packs} />;
}
