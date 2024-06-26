import { exec } from 'child_process';
import { logger } from './src/logger';

const npmCommand = "/home/tim/.npm-global/bin/npm";

export const clarionInstallPackagePlugin = () => ({
    name: 'clarion-install-package',
    configureServer(server) {
      server.ws.on('frontend:from-client', (data) => {
        if(data.install) {
          // call npm and install data.install
          exec(`${npmCommand} install ${data.install}`, (error, stdout, stderr) => {
            if (error) {
              console.error(`exec error: ${error}`);
              logger(`exec error: ${error}`);
              return;
            }
            console.log(`stdout: ${stdout}`);
            logger(`stdout: ${stdout}`);
            console.error(`stderr: ${stderr}`);
            if(stderr.length) logger(`stderr: ${stderr}`);
          });
        }
        if(data.uninstall) {
          // call npm and uninstall data.uninstall
          exec(`${npmCommand} uninstall ${data.uninstall}`, (error, stdout, stderr) => {
            if (error) {
              console.error(`exec error: ${error}`);
              logger(`exec error: ${error}`);
              return;
            }
            console.log(`stdout: ${stdout}`);
            logger(`stdout: ${stdout}`);
            console.error(`stderr: ${stderr}`);
            if(stderr.length) logger(`stderr: ${stderr}`);
          });
        }
      })
    },
});