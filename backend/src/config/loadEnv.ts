import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

const currentDir = path.dirname(fileURLToPath(import.meta.url));

const envPaths = [
  path.resolve(currentDir, "../../.env"),
  path.resolve(currentDir, "../../.env.local"),
];

for (const envPath of envPaths) {
  dotenv.config({
    override: true,
    path: envPath,
  });
}
