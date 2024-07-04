import * as fs from 'fs';

/* 
 * This function is used to dynamically generate routes for the Clarion app.
 * It reads the package.json file and looks for dependencies that have customFields.routes in their package.json.
 * It then generates a ClarionRoutes.tsx file that contains the routes for the Clarion app.
 * The generated file is used by App.tsx
 * The function is called by the clarionDynamicRoutesPlugin when package.json is updated.
 * The function is also called by the devSetupPlugin to ensure the ClarionRoutes.tsx file exists before starting the server.
 */

export const clarionDynamicRoutes = () => {
  const clarionPackage = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
  const dependencies = Object.keys(clarionPackage.dependencies);
  const imports = ['import { Route, Routes } from "react-router-dom";'];
  const components = {};

  dependencies.forEach((dependency) => {
    const path = `./node_modules/${dependency}/package.json`;
    const packageJson = JSON.parse(fs.readFileSync(path, 'utf8'));
    if (packageJson.customFields && packageJson.customFields.routes) {
      const routes = packageJson.customFields.routes;
      routes.forEach((route) => {
        const component = route.element.replace(" ", "").replace("<", "").replace("/>", "");
        components[component] = route.path;
      });
      const importStatement = `import { ${Object.keys(components).join(', ')} } from "${dependency}";`;
      imports.push(importStatement);
    }
  });

  components['div'] = '/';  // temporary fix for root route

  let output = imports.join('\n');
  output += '\n\n';
  output += 'export const ClarionRoutes = () => {\n';
  output += '  return (\n';
  output += '    <Routes>\n';
  Object.keys(components).forEach((component) => {
    output += `      <Route path="${components[component]}" element={<${component} />} />\n`;
  });
  output += '    </Routes>\n';
  output += '  );\n';
  output += '};\n';
  fs.writeFileSync('./src/ClarionRoutes.tsx', output, 'utf8');
};
