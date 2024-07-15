import * as fs from 'fs';

export const dynamicEventListeners = () => {
    const clarionPackage = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
    const dependencies = Object.keys(clarionPackage.dependencies);
    const imports = [
        'import { useEffect } from "react";',
        'import { WindowWS } from "@clarion-app/types";',
        'import "../Echo";',
        'import clarionAppsListener from "../clarionAppsListener";',
    ];
    const channels = [];

    dependencies.forEach((dependency) => {
        const path = `./node_modules/${dependency}/package.json`;
        const packageJson = JSON.parse(fs.readFileSync(path, 'utf8'));
        if (packageJson.customFields && packageJson.customFields.eventChannels) {
            const eventChannels = packageJson.customFields.eventChannels;
            channels.push(...eventChannels);
        }
    });

    let output = imports.join('\n');
    output += '\n\n';
    output += 'const useClarionEvents = () => {\n';
    output += '  useEffect(() => {\n';
    output += '    const win = window as unknown as WindowWS;\n\n';
    output += '    if (win.Echo) {\n';
    output += '      clarionAppsListener();\n';
    output += '    }\n\n';
    output += '    return () => {\n';
    output += '      if (win.Echo) {\n';
    output += '        win.Echo.leaveChannel(\'clarion-apps\');\n';
    channels.forEach((channel) => {
        output += `        win.Echo.leaveChannel('${channel}');\n`;
    });
    output += '      }\n';
    output += '    };\n';
    output += '  }, []);\n';
    output += '};\n\n';
    output += 'export default useClarionEvents;';
    fs.writeFileSync('./src/build/useClarionEvents.ts', output, 'utf8');
}