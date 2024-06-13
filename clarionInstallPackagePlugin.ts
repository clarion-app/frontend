import { exec } from 'child_process';

export const clarionInstallPackagePlugin = () => ({
    name: 'clarion-install-package',
    configureServer(server) {
      server.ws.on('frontend:from-client', (data) => {
        if(data.install) {
          // call npm and install data.install
          exec(`npm install ${data.install}`, (error, stdout, stderr) => {
            if (error) {
              console.error(`exec error: ${error}`);
              return;
            }
            console.log(`stdout: ${stdout}`);
            console.error(`stderr: ${stderr}`);
          });
        }
        if(data.uninstall) {
          // call npm and uninstall data.uninstall
          exec(`npm uninstall ${data.uninstall}`, (error, stdout, stderr) => {
            if (error) {
              console.error(`exec error: ${error}`);
              return;
            }
            console.log(`stdout: ${stdout}`);
            console.error(`stderr: ${stderr}`);
          });
        }
      })
    },
});