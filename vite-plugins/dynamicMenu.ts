import * as fs from 'fs';

/* 
 * This function is used to dynamically generate a menu for the Clarion app.
 * It reads the package.json file and looks for dependencies that have customFields.menu in their package.json.
 * It then generates a src/build/menu.json file that contains the menu entries for the Clarion app.
 * The generated file is used by src/CircleMenu.tsx.
 * The function is called by the dynamicRebuildPlugin when package.json is updated.
 * The function is also called by the devSetupPlugin to ensure the menu.json file exists before starting the server.
 */

export const dynamicMenu = () => {
  const clarionPackage = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
  const dependencies = Object.keys(clarionPackage.dependencies);
  const packages = {};

  dependencies.forEach((dependency) => {
    const path = `./node_modules/${dependency}/package.json`;
    const packageJson = JSON.parse(fs.readFileSync(path, 'utf8'));
    if (packageJson.customFields && packageJson.customFields.clarion) {
      const clarion = packageJson.customFields.clarion;
      if (packages[dependency] === undefined) {
        packages[dependency] = {};
      }
      const menuName = clarion.menu.name;
      const menuEntries = {};
      const entries = clarion.menu.entries;
      entries.forEach((entry) => {
        menuEntries[entry.name] = entry.path;
      });
      packages[dependency] = {
        name: menuName,
        entries: menuEntries
      }
    }
  });

  fs.writeFileSync('./src/build/menu.json', JSON.stringify(packages, null, 2), 'utf8');
};
