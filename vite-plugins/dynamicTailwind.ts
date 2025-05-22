import * as fs from 'fs';

const getTailwindContent = (configPath: string): any => {
  const fileText = fs.readFileSync(configPath, "utf-8");

  const match = fileText.match(/content\s*:\s*(\[[^\]]*\])/m);

  if (!match) {
    throw new Error("Could not find content array in tailwind config");
  }

  const contentArray = new Function(`return ${match[1]};`)();

  return contentArray;
}

const setTailwindContent = (configPath: string, newContent: any[]): void => {
  const fileText = fs.readFileSync(configPath, "utf-8");

  const contentRegex = /(content\s*:\s*)(\[[^\]]*\])/m;

  if (!contentRegex.test(fileText)) {
    throw new Error("Could not find content array in tailwind config");
  }

  const newContentString = JSON.stringify(newContent, null, 2);

  const updatedFileText = fileText.replace(contentRegex, `$1${newContentString}`);

  fs.writeFileSync(configPath, updatedFileText, "utf-8");
};

/*
const generateMainCss = (sources: string[]) => {
  sources.unshift("tailwindcss");
  
  const cssContent = sources.map((source) => {
    return `@import "${source}";`;
  }).join('\n') + '\n';

  fs.writeFileSync('./src/main.css', cssContent, 'utf-8');
};
*/

/* 
 * This function is used to dynamically update tailwind.config.cjs.
 * The function is called by the dynamicRebuildPlugin when package.json is updated.
 * The function is also called by the devSetupPlugin to ensure the menu.json file exists before starting the server.
 */

export const dynamicTailwind = () => {
  //const tailwindContent: string[] = []; 
  const tailwindContent = getTailwindContent('./tailwind.config.cjs');

  const clarionPackage = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
  const dependencies = Object.keys(clarionPackage.dependencies);

  dependencies.forEach((dependency) => {
    const path = `./node_modules/${dependency}/package.json`;
    const packageJson = JSON.parse(fs.readFileSync(path, 'utf8'));
    if (packageJson.customFields && packageJson.customFields.clarion) {
      const tailwindPath = `../node_modules/${dependency}/src/**/*.{js,ts,jsx,tsx}`;
      if (!tailwindContent.includes(tailwindPath)) {
        tailwindContent.push(tailwindPath);
      }
    }
  });

  setTailwindContent('./tailwind.config.cjs', tailwindContent);
  //generateMainCss(tailwindContent);

  console.log('Tailwind content updated:', tailwindContent);
};
