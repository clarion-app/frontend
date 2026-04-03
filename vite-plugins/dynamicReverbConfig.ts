import * as fs from 'fs';
import * as path from 'path';

/* 
 * This function is used to dynamically generate src/build/reverbConfig.json.
 * It reads VITE_REVERB_* environment variables with localhost defaults.
 * The generated file is used to tell packages how to contact the WebSocket server.
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

export const dynamicReverbConfig = () => {
  const env = loadEnvFile();
  const reverbConfig = {
    host: env.VITE_REVERB_HOST || process.env.VITE_REVERB_HOST || 'localhost',
    port: env.VITE_REVERB_PORT || process.env.VITE_REVERB_PORT || '8080',
    protocol: env.VITE_REVERB_PROTOCOL || process.env.VITE_REVERB_PROTOCOL || 'http',
    appKey: env.VITE_REVERB_APP_KEY || process.env.VITE_REVERB_APP_KEY || 'your-reverb-app-key'
  };
  const output = JSON.stringify(reverbConfig, null, 2);
  fs.writeFileSync('./src/build/reverbConfig.json', output, 'utf8');
};
