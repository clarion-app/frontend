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
  const packages: { [key:string]: PackageDataType } = {};
  
  dependencies.forEach((dependency) => {
    const path = `./node_modules/${dependency}/package.json`;
    const packageJson = JSON.parse(fs.readFileSync(path, 'utf8'));
    if(!packageJson.customFields) return;
    if(!packageJson.customFields.clarion) return;
    const clarion = packageJson.customFields.clarion;
    packages[dependency] = clarion;
    if (clarion.initializer) {
      imports.push(`import { ${packages[dependency].initializer} } from "${dependency}";`);
    }

    if(clarion.setToken) {
      imports.push(`import { ${packages[dependency].setToken} } from "${dependency}";`);
    }
  });

  if(Object.keys(packages).length !== 0) {
    imports.unshift('import { backendUrl } from "./backendUrl"');
  }
  
  let output = imports.join('\n');
  output += '\n\n';
  output += 'export const initializePackages = () => {\n';
  Object.keys(packages).forEach((dependency) => {
    output += `  ${packages[dependency].initializer}(backendUrl);\n`;
  });
  output += '}\n\n';
  output += 'export const setPackageToken = (token: string) => {\n';
  output += '  if(!token) return;\n';
  Object.keys(packages).forEach((dependency) => {
    output += `  ${packages[dependency].setToken}(token);\n`;
  });
  output += '}\n\n';

  fs.writeFileSync('./src/build/initializePackages.ts', output);
};