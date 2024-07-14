import { backendUrl } from "./build/backendUrl"

const AppManager = () => {
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

  const appPackageAction = (action: string) => {
    if(action !== 'install' && action !== 'uninstall') return;
    const packageName = (document.getElementById('appPackage') as HTMLInputElement).value;
    if(packageName.length === 0) return;
    const url = `${backendUrl}/api/app/${action}`;
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ package: packageName })
    }).then(response => response.json())
      .then(data => console.log(data))
      .catch(error => console.error(error));
  }

  return <section className="section fixed-grid has-3-cols">
    <h1 className="title">App Manager</h1>
    <div className="grid">
      <div className="cell">
      <input type="text" id="appPackage" placeholder="Clarion Package Name" />
      </div>
      <div className="cell">
      <button onClick = {() => appPackageAction('install')} className="button is-primary is-small">Install</button>
      </div>
      <div className="cell">
      <button onClick = {() => appPackageAction('uninstall')} className="button is-danger is-small">Uninstall</button>
      </div>
    </div>
    <div className="grid">
      <div className="cell">
        <input type="text" id="npmPackage" placeholder="NPM Package Name" />
      </div>
      <div className="cell">
        <button onClick = {() => npmPackageAction('install')} className="button is-primary is-small">Install</button>
      </div>
      <div className="cell">
        <button onClick = {() => npmPackageAction('uninstall')} className="button is-danger is-small">Uninstall</button>
        </div>
      </div>
      <div className="grid">
        <div className="cell">
        <input type="text" id="composerPackage" placeholder="Composer Package Name" />
        </div>
        <div className="cell">
        <button onClick = {() => composerPackageAction('install')} className="button is-primary is-small">Install</button>
        </div>
        <div className="cell">
        <button onClick = {() => composerPackageAction('uninstall')} className="button is-danger is-small">Uninstall</button>
        </div>
      </div>
  </section>;
};

export default AppManager;