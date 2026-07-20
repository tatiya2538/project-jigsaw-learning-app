import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const nextBin = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "node_modules",
  "next",
  "dist",
  "bin",
  "next",
);

const nodeArgs =
  process.platform === "win32"
    ? ["--use-system-ca", nextBin, "dev"]
    : [nextBin, "dev"];

const result = spawnSync("node", nodeArgs, { stdio: "inherit" });
process.exit(result.status ?? 1);
