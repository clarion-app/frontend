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
    imports.push(`import { updateFrontend as ${prefix}UpdateFrontend } from "${dependency}";`);
  });

  if(Object.keys(prefixes).length !== 0) {
    imports.unshift('import { BackendType, LoggedInUserType } from "@clarion-app/types"');
    imports.unshift('import { backendUrl } from "./backendUrl"');
  }
  
  let output = imports.join('\n');
  output += '\n\n';
  output += 'export const updatePackages = () => {\n';
  output += '  const user: LoggedInUserType = {\n';
  output += '    id: localStorage.getItem("id") || "",\n';
  output += '    name: localStorage.getItem("name") || "",\n';
  output += '    email: localStorage.getItem("email") || "",\n';
  output += '  };\n';
  output += '  const backend: BackendType = {\n';
  output += '    url: backendUrl,\n';
  output += '    token: localStorage.getItem("token") || "",\n';
  output += '    user: user\n';
  output += '  };\n';
  Object.keys(prefixes).forEach((dependency) => {
    output += `  ${prefixes[dependency]}UpdateFrontend(backend);\n`;
  });
  output += '}\n\n';

  fs.writeFileSync('./src/build/initializePackages.ts', output);
};