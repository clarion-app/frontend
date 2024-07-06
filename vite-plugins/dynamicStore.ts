import * as fs from 'fs';
import { PackageDataType } from '@clarion-app/types';

/* 
 * This function is used to dynamically generate the store for the Clarion app.
 * It reads the package.json file and looks for dependencies that have customFields.api in their package.json.
 * It then generates a src/build/store/index.ts file that contains the redux store for the Clarion app.
 * The generated store is used by main.tsx
 * The function is called by the dynamicRebuildPlugin when package.json is updated.
 * The function is also called by the devSetupPlugin to ensure the store exists before starting the server.
 */

export const dynamicStore = () => {
  const clarionPackage = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
  const dependencies = Object.keys(clarionPackage.dependencies);

  const imports: string[] = [ 
    'import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";',
    'import { initializePackages } from "../initializePackages";'
  ];
  const packages: { [key:string]: PackageDataType } = {};
  
  dependencies.forEach((dependency) => {
    const path = `./node_modules/${dependency}/package.json`;
    const packageJson = JSON.parse(fs.readFileSync(path, 'utf8'));
    if(!packageJson.customFields) return;
    if (packageJson.customFields.api) {
      packages[dependency] = packageJson.customFields;
      imports.push(`import { ${packages[dependency].api} } from "${dependency}";`);
    }
  });
  
  let output = imports.join('\n');
  output += '\n\n';
  output += 'initializePackages();\n\n';
  output += 'export const store = configureStore({\n';
  output += '  reducer: {\n';
  Object.keys(packages).forEach((dependency) => {
    const reducerPath = packages[dependency].api + '.reducerPath';
    const reducer = packages[dependency].api + '.reducer';
    output += `    [${reducerPath}]: ${reducer},\n`;
  });
  output += '  },\n';
  output += '  middleware: (getDefaultMiddleware) =>\n';
  output += '    getDefaultMiddleware()\n';
  Object.keys(packages).forEach((dependency) => {
    const middleware = packages[dependency].api + '.middleware';
    output += `      .concat(${middleware})\n`;
  });
  output += '});\n\n';
  output += 'export type AppDispatch = typeof store.dispatch;\n';
  output += 'export type RootState = ReturnType<typeof store.getState>;\n';
  output += 'export type AppThunk<ReturnType = void> = ThunkAction<\n';
  output += '  ReturnType,\n';
  output += '  RootState,\n';
  output += '  unknown,\n';
  output += '  Action<string>\n';
  output += '>;\n';
  fs.writeFileSync('./src/build/store/index.ts', output, 'utf8');
};
