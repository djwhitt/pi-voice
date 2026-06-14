#!/usr/bin/env node
/**
 * pi-voice launcher.
 *
 * The CLI is authored in TypeScript (src/cli.ts) and relies on jiti to strip
 * types at runtime. The upstream bin pointed Node directly at the .ts file with
 * `#!/usr/bin/env -S node --import jiti`, which has two problems on modern Node:
 *
 *   1. `--import jiti` imports jiti's main entry, which does NOT register the
 *      TS loader hooks (the correct entry is `jiti/register`). Without the
 *      hooks, Node falls back to its native type-stripper, which refuses .ts
 *      files under node_modules (ERR_UNSUPPORTED_NODE_MODULES_TYPE_STRIPPING).
 *   2. Bare specifiers passed to `--import` resolve relative to the current
 *      working directory, not the package, so `jiti` is not found when the
 *      command is run from an unrelated directory (ERR_MODULE_NOT_FOUND).
 *
 * This launcher sidesteps both: a bare `import` inside a real module resolves
 * relative to THIS file (not the cwd), and createJiti() registers the loader
 * before the CLI is imported.
 */
import { createJiti } from "jiti";

const jiti = createJiti(import.meta.url);
await jiti.import("../src/cli.ts");
