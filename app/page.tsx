import AdventurePlayer from "@/components/adventure/AdventurePlayer";
import { loadScenarioPacks } from "@/lib/scenarios/loader";

export default async function Home() {
  const packs = await loadScenarioPacks();
  return <AdventurePlayer packs={packs} />;
}
