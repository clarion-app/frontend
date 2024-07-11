import { ClarionRoutes } from "./build/ClarionRoutes";
import { Menu } from "./build/Menu";
import './Echo';
import { useEffect } from 'react';
import { WindowWS } from "./types";

function App() {
  useEffect(() => {
    const win = window as unknown as WindowWS;
    if (win.Echo) {
        win.Echo.channel('clarion-apps')
            .listen('.ClarionApp\\Backend\\Events\\InstallNPMPackageEvent', (e: any) => {
              console.log('Installing:', e.package);
              if (!import.meta.hot) return;
              if(!e.package || e.package.length === 0) return;
              import.meta.hot.send('frontend:from-client', { "install": e.package });
            })
            .listen('.ClarionApp\\Backend\\Events\\UninstallNPMPackageEvent', (e: any) => {
              console.log('Uninstalling:', e.package);
              if (!import.meta.hot) return;
              if(!e.package || e.package.length === 0) return;
              import.meta.hot.send('frontend:from-client', { "uninstall": e.package });
            });
    }

    return () => {
        if (win.Echo) {
            win.Echo.leaveChannel('clarion-apps');
        }
    };
  }, []);
  return (
    <>
      <Menu />
      <ClarionRoutes />
    </>
  )
}

export default App
