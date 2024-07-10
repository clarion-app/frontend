import * as fs from 'fs';

/* 
 * This function is used to dynamically generate src/build/reverbConfig.json.
 * It reads the package.json file and looks for customFields.backendUrl.
 * The generated file is used to tell packages how to contact the backend server.
 * The function is called by the dynamicRebuildPlugin when package.json is updated.
 * The function is also called by the devSetupPlugin to ensure the ClarionMenu.tsx file exists before starting the server.
 */

export const dynamicReverbConfig = () => {
  let reverbConfig = {
    host: 'localhost',
    port: 8080,
    protocol: 'http',
    appKey: 'ABCXYZ'
  };

  const clarionPackage = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
  if(clarionPackage.customFields && clarionPackage.customFields.reverb) {
    reverbConfig = clarionPackage.customFields.reverb;
  }
  const output = JSON.stringify(reverbConfig, null, 2);
  fs.writeFileSync('./src/build/reverbConfig.json', output, 'utf8');
};
