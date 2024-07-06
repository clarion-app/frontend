import { exec } from 'child_process';
import { logger } from '../logger';

const npmCommand = "./node_modules/.bin/npm";

export const installPackagePlugin = () => ({
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
            if(stderr.length) {
              console.error(`stderr: ${stderr}`);
              logger(`stderr: ${stderr}`);
            }
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
            if(stderr.length) {
              console.error(`stderr: ${stderr}`);
              logger(`stderr: ${stderr}`);
            }
          });
        }
      })
    },
});
