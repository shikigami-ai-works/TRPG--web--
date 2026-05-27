import { promises as fs } from "fs";
import path from "path";

import { parseYaml } from "./simple-yaml";
import type {
  EndingDefinition,
  ItemDefinition,
  NpcDefinition,
  ScenarioDefinition,
  ScenarioPack,
  SceneDefinition,
} from "./types";

const SCENARIOS_DIR = path.join(process.cwd(), "scenarios");

export async function loadScenarioPacks(): Promise<ScenarioPack[]> {
  const entries = await fs.readdir(SCENARIOS_DIR, { withFileTypes: true });
  const scenarioDirs = entries
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith("_"))
    .map((entry) => entry.name)
    .sort();

  const packs = await Promise.all(scenarioDirs.map((directory) => loadScenarioPack(directory)));
  return packs;
}

export async function loadScenarioPack(directory: string): Promise<ScenarioPack> {
  const base = path.join(SCENARIOS_DIR, directory);
  const scenarioFile = await readYamlFile<{ scenario: ScenarioDefinition }>(base, "scenario.yaml");
  const npcsFile = await readYamlFile<{ npcs: NpcDefinition[] }>(base, "npcs.yaml");
  const scenesFile = await readYamlFile<{ scenes: SceneDefinition[] }>(base, "scenes.yaml");
  const itemsFile = await readYamlFile<{ items: ItemDefinition[] }>(base, "items.yaml");
  const endingsFile = await readYamlFile<{ endings: EndingDefinition[] }>(base, "endings.yaml");

  return {
    directory,
    scenario: scenarioFile.scenario,
    npcs: npcsFile.npcs,
    scenes: scenesFile.scenes,
    items: itemsFile.items,
    endings: endingsFile.endings,
  };
}

async function readYamlFile<T>(base: string, fileName: string): Promise<T> {
  const raw = await fs.readFile(path.join(base, fileName), "utf8");
  return parseYaml(raw) as T;
}
