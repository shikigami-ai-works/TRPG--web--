import ScenarioExplorer from "@/components/ScenarioExplorer";
import { loadScenarioPacks } from "@/lib/scenarios/loader";

export default async function Home() {
  const packs = await loadScenarioPacks();
  return <ScenarioExplorer packs={packs} />;
}
