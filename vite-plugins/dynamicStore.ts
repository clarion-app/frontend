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
    'import { updatePackages } from "../initializePackages";',
    'import { backendUrl } from "../backendUrl";',
    'import { appApi } from "../../appApi";',
    'import { userApi } from "../../user/userApi";',
    'import tokenReducer from "../../user/tokenSlice";',
    'import loggedInUserReducer from "../../user/loggedInUserSlice";',
    'import { localNodesApi } from "../../node/localNodesApi";',
    'import currentNodeReducer from "../../node/currentNodeSlice";',
  ];
  const packages: { [key:string]: PackageDataType } = {};
  const prefixes: { [key:string]: string } = {};
  
  dependencies.forEach((dependency) => {
    const path = `./node_modules/${dependency}/package.json`;
    const packageJson = JSON.parse(fs.readFileSync(path, 'utf8'));
    if(!packageJson.customFields) return;
    if(!packageJson.customFields.clarion) return;
    const clarion = packageJson.customFields.clarion;
    if(!clarion.api) return;
    prefixes[dependency] = dependency.replace('@', '_').replace('/', '_').replace(/-/g, '_');
    packages[dependency] = clarion;
    clarion.api.forEach((apiName) => {
      imports.push(`import { ${apiName} as ${prefixes[dependency]}${apiName} } from "${dependency}";`);
    });
  });
  
  let output = imports.join('\n');
  output += '\n\n';
  output += 'updatePackages();\n\n';
  output += 'export const store = configureStore({\n';
  output += '  reducer: {\n';
  output += '    token: tokenReducer,\n';
  output += '    loggedInUser: loggedInUserReducer,\n';
  output += '    [appApi.reducerPath]: appApi.reducer,\n';
  output += '    [userApi.reducerPath]: userApi.reducer,\n';
  output += '    [localNodesApi.reducerPath]: localNodesApi.reducer,\n';
  output += '    currentNode: currentNodeReducer,\n';
  Object.keys(packages).forEach((dependency) => {
    packages[dependency].api.forEach((apiName) => {
      const reducerPath = prefixes[dependency] + apiName + '.reducerPath';
      const reducer = prefixes[dependency] + apiName + '.reducer';
      output += `    [${reducerPath}]: ${reducer},\n`;
    });
  });
  output += '  },\n';
  output += '  middleware: (getDefaultMiddleware) =>\n';
  output += '    getDefaultMiddleware()\n';
  output += '      .concat(appApi.middleware)\n';
  output += '      .concat(userApi.middleware)\n';
  output += '      .concat(localNodesApi.middleware)\n';
  Object.keys(packages).forEach((dependency) => {
    packages[dependency].api.forEach((apiName) => {
      const middleware = prefixes[dependency] + apiName + '.middleware';
      output += `      .concat(${middleware})\n`;
    });
  });
  output += '});\n\n';

  output += 'store.subscribe(() => {\n';
  output += '  const state = store.getState();\n';
  output += '  localStorage.setItem("token", state.token.value);\n';
  output += '  localStorage.setItem("name", state.loggedInUser.value.name);\n';
  output += '  localStorage.setItem("email", state.loggedInUser.value.email);\n';
  output += '  localStorage.setItem("id", state.loggedInUser.value.id);\n';
  output += '  updatePackages();\n';
  output += '});\n\n';

  output += 'export const resetAllApiStates = () => {\n';
  Object.keys(packages).forEach((dependency) => {
    packages[dependency].api.forEach((apiName) => {
      const api = prefixes[dependency] + apiName;
      output += `  store.dispatch(${api}.util.resetApiState());\n`;
    });
  });
  output += '};\n\n';

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
