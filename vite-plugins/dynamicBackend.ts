import * as fs from 'fs';
import * as path from 'path';

/* 
 * This function is used to dynamically generate src/build/backendUrl.ts.
 * It reads the VITE_BACKEND_URL environment variable with fallback to http://localhost:8000.
 * The generated file is used to tell packages how to contact the backend server.
 * The function is called by the dynamicRebuildPlugin when package.json is updated.
 * The function is also called by the devSetupPlugin to ensure the ClarionMenu.tsx file exists before starting the server.
 */

const loadEnvFile = (): Record<string, string> => {
  const envPath = path.resolve(process.cwd(), '.env');
  if (!fs.existsSync(envPath)) return {};
  const content = fs.readFileSync(envPath, 'utf8');
  const env: Record<string, string> = {};
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIndex = trimmed.indexOf('=');
    if (eqIndex === -1) continue;
    env[trimmed.slice(0, eqIndex).trim()] = trimmed.slice(eqIndex + 1).trim();
  }
  return env;
};

export const dynamicBackend = () => {
  const env = loadEnvFile();
  const backendUrl = env.VITE_BACKEND_URL || process.env.VITE_BACKEND_URL || 'http://localhost:8000';
  const output = `export const backendUrl = "${backendUrl}";\n`;
  fs.writeFileSync('./src/build/backendUrl.ts', output, 'utf8');
};
