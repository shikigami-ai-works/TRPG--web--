import { loadScenarioPacks } from "../lib/scenarios/loader";
import {
  formatScenarioValidationResults,
  hasScenarioValidationErrors,
  validateScenarioPacks,
} from "../lib/scenarios/validation";

async function main(): Promise<void> {
  try {
    const packs = await loadScenarioPacks();
    const results = validateScenarioPacks(packs);
    console.log(formatScenarioValidationResults(results));

    if (hasScenarioValidationErrors(results)) {
      process.exitCode = 1;
    }
  } catch (error) {
    console.error(`Scenario validation failed: ${error instanceof Error ? error.message : String(error)}`);
    process.exitCode = 1;
  }
}

void main();
