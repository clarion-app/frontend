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
          .listen('InstallNPMPackageEvent', (e: any) => {
              console.log('Package installed:', e.package);
          })
          .listen('UninstallNPMPackageEvent', (e: any) => {
              console.log('Package uninstalled:', e.package);
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
