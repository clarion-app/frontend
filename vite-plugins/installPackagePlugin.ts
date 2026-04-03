import { exec } from 'child_process';
import { logger } from '../logger';
import { validatePackageName } from '../src/validation/validatePackageName';

const npmCommand = "./node_modules/.bin/npm";

export const installPackagePlugin = () => ({
    name: 'clarion-install-package',
    configureServer(server) {
      server.ws.on('frontend:from-client', (data) => {
        if(data.install) {
          if (!validatePackageName(data.install)) {
            console.error('Install rejected: invalid package name:', data.install);
            logger('Install rejected: invalid package name: ' + data.install);
            return;
          }
          // call npm and install data.install
          exec(`${npmCommand} install ${data.install} --legacy-peer-deps`, (error, stdout, stderr) => {
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
          if (!validatePackageName(data.uninstall)) {
            console.error('Uninstall rejected: invalid package name:', data.uninstall);
            logger('Uninstall rejected: invalid package name: ' + data.uninstall);
            return;
          }
          // call npm and uninstall data.uninstall
          exec(`${npmCommand} uninstall ${data.uninstall} --legacy-peer-deps`, (error, stdout, stderr) => {
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
