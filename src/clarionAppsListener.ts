import { WindowWS } from '@clarion-app/types';
import './Echo';
import { validatePackageName } from './validation/validatePackageName';

const clarionAppsListener = () => {
    const win = window as unknown as WindowWS;
    win.Echo.channel('clarion-apps')
      .listen('.ClarionApp\\Backend\\Events\\InstallNPMPackageEvent', (e: any) => {
        console.log('Installing:', e.package);
        if (!import.meta.hot || !e.package || e.package.length === 0) return;
        if (!validatePackageName(e.package)) {
          console.error('Invalid package name rejected:', e.package);
          return;
        }
        import.meta.hot.send('frontend:from-client', { "install": e.package });
      })
      .listen('.ClarionApp\\Backend\\Events\\UninstallNPMPackageEvent', (e: any) => {
        console.log('Uninstalling:', e.package);
        if (!import.meta.hot || !e.package || e.package.length === 0) return;
        if (!validatePackageName(e.package)) {
          console.error('Invalid package name rejected:', e.package);
          return;
        }
        import.meta.hot.send('frontend:from-client', { "uninstall": e.package });
      });
};

export default clarionAppsListener;