import * as fs from 'fs';

/* 
 * This function is used to dynamically generate src/backendUrl.ts.
 * It reads the package.json file and looks for customFields.backendUrl.
 * The generated file is used to tell packages how to contact the backend server.
 * The function is called by the clarionDynamicRebuildPlugin when package.json is updated.
 * The function is also called by the devSetupPlugin to ensure the ClarionMenu.tsx file exists before starting the server.
 */

export const clarionDynamicBackend = () => {
  const clarionPackage = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
  console.log(clarionPackage);
  if(!clarionPackage.customFields || !clarionPackage.customFields.backendUrl) return;

  const output = `export const backendUrl = "${clarionPackage.customFields.backendUrl}";\n`;
  fs.writeFileSync('./src/backendUrl.ts', output, 'utf8');
};
