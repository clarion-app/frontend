import * as fs from 'fs';
import { PackageDataType } from '@clarion-app/types';

/* 
 * This function is used to dynamically generate src/build/initializePackages.ts for the Clarion app.
 * It reads the package.json file and looks for dependencies that have customFields.packageInitializer in their package.json.
 * It then generates an initializePackage function that calls each initializer.
 * The generated function is used by src/build/store/index.ts
 * The function is called by the dynamicRebuildPlugin when package.json is updated.
 * The function is also called by the devSetupPlugin to ensure the store exists before starting the server.
 */

export const dynamicPackageInitializer = () => {
  const clarionPackage = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
  const dependencies = Object.keys(clarionPackage.dependencies);

  const imports: string[] = [
  ];
  const prefixes: { [key:string]: string } = {};
  
  dependencies.forEach((dependency) => {
    const path = `./node_modules/${dependency}/package.json`;
    const packageJson = JSON.parse(fs.readFileSync(path, 'utf8'));
    if(!packageJson.customFields) return;
    if(!packageJson.customFields.clarion) return;
    const prefix = dependency.replace('@', '_').replace('/', '_').replace(/-/g, '_');
    prefixes[dependency] = prefix;
    imports.push(`import { initializeFrontend as ${prefix}InitializeFrontend } from "${dependency}";`);
    imports.push(`import { setFrontendToken as ${prefix}SetFrontendToken } from "${dependency}";`);
  });

  if(Object.keys(prefixes).length !== 0) {
    imports.unshift('import { backendUrl } from "./backendUrl"');
  }
  
  let output = imports.join('\n');
  output += '\n\n';
  output += 'export const initializePackages = () => {\n';
  Object.keys(prefixes).forEach((dependency) => {
    output += `  ${prefixes[dependency]}InitializeFrontend(backendUrl);\n`;
  });
  output += '}\n\n';
  output += 'export const setPackageToken = (token: string) => {\n';
  output += '  if(!token) return;\n';
  Object.keys(prefixes).forEach((dependency) => {
    output += `  ${prefixes[dependency]}SetFrontendToken(token);\n`;
  });
  output += '}\n\n';

  fs.writeFileSync('./src/build/initializePackages.ts', output);
};