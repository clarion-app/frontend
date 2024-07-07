import { ClarionRoutes } from "./build/ClarionRoutes";
import { Menu } from "./build/Menu";
import { backendUrl } from "./build/backendUrl"

function App() {
  // Tells the dev server to install or uninstall a package.
  const npmPackageAction = (action: string) => {
    if (!import.meta.hot) return;
    const packageName = (document.getElementById('npmPackage') as HTMLInputElement).value;
    if(packageName.length === 0) return;
    import.meta.hot.send('frontend:from-client', { [action]: packageName }); 
  };

  // tells the backend server to install or uninstall a composer package
  const composerPackageAction = (action: string) => {
    if(action !== 'install' && action !== 'uninstall') return;
    const url = `${backendUrl}/api/composer/${action}`;
    const packageName = (document.getElementById('composerPackage') as HTMLInputElement).value;
    if(packageName.length === 0) return;
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ package: packageName })
    }).then(response => response.json())
      .then(data => console.log(data))
      .catch(error => console.error(error));
  };
  
  return (
    <>
      <Menu />
      <ClarionRoutes />
      <div>
        <input type="text" id="npmPackage" placeholder="NPM Package Name" />
        <button onClick = {() => npmPackageAction('install')}>Install</button>
        <button onClick = {() => npmPackageAction('uninstall')}>Uninstall</button>
      </div>
      <div>
        <input type="text" id="composerPackage" placeholder="Composer Package Name" />
        <button onClick = {() => composerPackageAction('install')}>Install</button>
        <button onClick = {() => composerPackageAction('uninstall')}>Uninstall</button>
      </div>
    </>
  )
}

export default App
