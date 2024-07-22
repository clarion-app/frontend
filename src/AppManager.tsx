import { backendUrl } from "./build/backendUrl"
import { useGetAppsQuery } from "./appApi";

const AppManager = () => {
  const { data } = useGetAppsQuery(null);
  console.log(data);

  // Tells the dev server to install or uninstall a package.
  const npmPackageAction = (action: string, name?: string) => {
    if (!import.meta.hot) return;
    const packageName = name || (document.getElementById('npmPackage') as HTMLInputElement).value;
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

  const appPackageAction = (action: string, packageName: string) => {
    if(action !== 'install' && action !== 'uninstall') return;
    if(packageName.length === 0) return;
    const url = `${backendUrl}/api/app/${action}`;
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ package: packageName })
    }).then(response => response.json())
      .then(data => {
        console.log(data);
        data.forEach((app: any) => {
          npmPackageAction(action, app);
        });
      })
      .catch(error => console.error(error));
  }

  return <div className="fixed-grid has-4-cols">
    <h1 className="title">App Manager</h1>
    <h2>Installed Apps</h2>
    <div className="grid">
      <div className="cell">App Name</div>
      <div className="cell">Description</div>
      <div className="cell">Package</div>
      <div className="cell">Installed</div>
    </div>
    {data && data.map((app: any) => {
      return <div className="grid" key={app.id}>
        <div className="cell">{app.title}</div>
        <div className="cell">{app.description}</div>
        <div className="cell">{app.package}</div>
        <div className="cell">
          {app.installed ? 
          <button onClick = {() => appPackageAction('uninstall', app.package)} className="button is-danger is-small">Uninstall</button> : 
          <button onClick = {() => appPackageAction('install', app.package)} className="button is-primary is-small">Install</button>}
        </div>
      </div>
    })}

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
  </div>;
};

export default AppManager;