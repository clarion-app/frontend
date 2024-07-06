import * as fs from 'fs';
import { PackageDataType } from '@clarion-app/types';

/* 
 * This function is used to dynamically generate src/initializePackages.ts for the Clarion app.
 * It reads the package.json file and looks for dependencies that have customFields.packageInitializer in their package.json.
 * It then generates an initializePackage function that calls each initializer.
 * The generated function is used by src/store/index.ts
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
    if (packageJson.customFields.initializer) {
      packages[dependency] = packageJson.customFields;
      imports.push(`import { ${packages[dependency].initializer} } from "${dependency}";`);
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
  output += '}\n';

  fs.writeFileSync('./src/initializePackages.ts', output);
};