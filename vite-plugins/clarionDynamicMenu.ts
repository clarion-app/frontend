import * as fs from 'fs';

/* 
 * This function is used to dynamically generate a menu for the Clarion app.
 * It reads the package.json file and looks for dependencies that have customFields.routes in their package.json.
 * It then generates a ClarionMenu.tsx file that contains the menu for the Clarion app.
 * The generated file is used by App.tsx
 * The function is called by the clarionDynamicRebuildPlugin when package.json is updated.
 * The function is also called by the devSetupPlugin to ensure the ClarionMenu.tsx file exists before starting the server.
 */

export const clarionDynamicMenu = () => {
  const clarionPackage = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
  const dependencies = Object.keys(clarionPackage.dependencies);
  const packages = {};

  dependencies.forEach((dependency) => {
    const path = `./node_modules/${dependency}/package.json`;
    const packageJson = JSON.parse(fs.readFileSync(path, 'utf8'));
    if (packageJson.customFields && packageJson.customFields.routes) {
      if (packages[dependency] === undefined) {
        packages[dependency] = {};
      }
      const routes = packageJson.customFields.routes;
      routes.forEach((route) => {
        packages[dependency][route.name] = route.path;
      });
    }
  });

  let output = 'export const ClarionMenu = () => {\n';
  output += '  return (\n';
  output += '    <div>\n';
  output += '      <div>\n'
  output += '        <h2>Clarion</h2>\n';
  output += '        <a href="/">Home</a>\n';
  output += '      </div>\n';
  Object.keys(packages).forEach((packageName) => {
    output += `      <div>\n`;
    output += `        <h2>${packageName}</h2>\n`;
    Object.keys(packages[packageName]).forEach((el) => {
      output += `        <a href="${packages[packageName][el]}">${el}</a>\n`;
    });
    output += `      </div>\n`;
  });
  output += '    </div>\n';
  output += '  );\n';
  output += '};\n';
  fs.writeFileSync('./src/ClarionMenu.tsx', output, 'utf8');
};
