import * as fs from 'fs';

export const clarionDynamicRoutesPlugin = () => ({
    name: 'clarion-dynamic-routes',
    handleHotUpdate({file, timestamp }) {
      //split file into path and filename
      const fileParts = file.split('/');
      const filename = fileParts[fileParts.length - 1];
      if(filename !== 'package.json') return;
  
      console.log(`${timestamp}: ${file} updated`);
    
      const clarionPackage = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
      //store keys from clarionPackage.dependencies in array
      const dependencies = Object.keys(clarionPackage.dependencies);
      const imports = [ 'import { Route, Routes } from "react-router-dom";' ];
      const components = {};
  
      dependencies.forEach((dependency) => {
        const path = `./node_modules/${dependency}/package.json`;
        const packageJson = JSON.parse(fs.readFileSync(path, 'utf8'));
        // check customFields for routes key
        if(packageJson.customFields && packageJson.customFields.routes) {
          const routes = packageJson.customFields.routes;
          routes.forEach((route) => {
            const component = route.element.replace(" ", "").replace("<", "").replace("/>", "");
            components[component] = route.path;
          });
          const importStatement = `import { ${Object.keys(components).join(', ')} } from "${dependency}";`;
          imports.push(importStatement);
        }
      });
  
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
      output += '};';
      // write imports to src/ClarionRoutes.tsx
      fs.writeFileSync('./src/ClarionRoutes.tsx', output, 'utf8');
    }
  });