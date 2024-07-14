import * as fs from 'fs';

export const dynamicEventListeners = () => {
    const clarionPackage = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
    const dependencies = Object.keys(clarionPackage.dependencies);
    const imports = [
        'import { useEffect } from "react";',
        'import { WindowWS } from "@clarion-app/types";',
        'import "../Echo";'
    ];
    const listeners = {};

    // function to take this-style-name and change it to ThisStyleName
    const toPascalCase = (str) => {
        return str
            .toLowerCase()
            .split('-')
            .map((word, index) => {
                if (index === 0) {
                    return word.charAt(0).toUpperCase() + word.slice(1);
                }
                return word.charAt(0).toUpperCase() + word.slice(1);
            })
            .join('');
    };

    dependencies.forEach((dependency) => {
        const packageListeners = {};
        const path = `./node_modules/${dependency}/package.json`;
        const packageJson = JSON.parse(fs.readFileSync(path, 'utf8'));
        const [org, name] = packageJson.name.split('/');
        if (packageJson.customFields && packageJson.customFields.eventChannels) {
            const eventChannels = packageJson.customFields.eventChannels;
            const channels = Object.keys(eventChannels);
            channels.forEach((channel) => {
                const realName = eventChannels[channel];
                const aliasedName = `${eventChannels[channel]}${toPascalCase(name)}`;
                imports.push(`import { ${realName} as ${aliasedName} } from "${dependency}";`);
                listeners[channel] = aliasedName;
            });
        }
    });

    let output = imports.join('\n');
    output += '\n\n';
    output += 'const useClarionEvents = () => {\n';
    output += '  useEffect(() => {\n';
    output += '    const win = window as unknown as WindowWS;\n\n';
    output += '    if (win.Echo) {\n';
    Object.keys(listeners).forEach((listener) => {
        output += `      win.Echo.channel('${listener}')\n`;
        output += `        .listen('*', (e: any) => {\n`;
        output += `          console.log('${listener}:', e);\n`;
        output += `          ${listeners[listener]}(e);\n`;
        output += '        })\n';
    });
    output += '    }\n\n';
    output += '    return () => {\n';
    output += '      if (win.Echo) {\n';
    output += '        win.Echo.leaveChannel(\'clarion-apps\');\n';
    Object.keys(listeners).forEach((listener) => {
        output += `        win.Echo.leaveChannel('${listener}');\n`;
    });
    output += '      }\n';
    output += '    };\n';
    output += '  }, []);\n';
    output += '};\n\n';
    output += 'export default useClarionEvents;';
    fs.writeFileSync('./src/build/useClarionEvents.ts', output, 'utf8');
}