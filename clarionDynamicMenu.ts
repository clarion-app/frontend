import * as fs from 'fs';
import { logger } from './src/logger';

export const clarionDynamicMenu = (file: string, timestamp: number) => {
  const fileParts = file.split('/');
  const filename = fileParts[fileParts.length - 1];
  if (filename !== 'package.json') return;

  console.log(`${timestamp}: ${file} updated`);
  logger(`${file} updated`);

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
    Object.keys(packages[packageName]).forEach((path) => {
      output += `        <a href="${path}">${packages[packageName][path]}</a>\n`;
    });
    output += `      </div>\n`;
  });
  output += '    </div>\n';
  output += '  );\n';
  output += '};\n';
  fs.writeFileSync('./src/ClarionMenu.tsx', output, 'utf8');
};
