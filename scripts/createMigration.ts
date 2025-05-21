import { execSync } from "child_process";
import path from "path";

const timestamp = new Date()
  .toISOString()
  .replace(/[-T:.Z]/g, "")
  .slice(0, 14);

const migrationName = `migration-${timestamp}`;
const migrationPath = path.resolve("src/migrations", migrationName);

const command = `ts-node ./node_modules/typeorm/cli.js migration:create ${migrationPath}`;
console.log(`🛠️ Executando: ${command}`);
execSync(command, { stdio: "inherit" });

const lintCommand = `npx eslint --fix --ext .ts src/migrations`;
console.log(`🎯 Executando ESLint: ${lintCommand}`);
execSync(lintCommand, { stdio: "inherit" });
