import { ClarionRoutes } from "./ClarionRoutes";
import { ClarionMenu } from "./ClarionMenu";

function App() {
  // Tells the dev server to install or uninstall a package.
  const packageAction = (action: string) => {
    if (!import.meta.hot) return;
    const packageName = (document.getElementById('package') as HTMLInputElement).value;
    if(packageName.length === 0) return;
    import.meta.hot.send('frontend:from-client', { [action]: packageName }); 
  };
  
  return (
    <>
      <ClarionMenu />
      <ClarionRoutes />
      <input type="text" id="package" placeholder="Package Name" />
      <button onClick = {() => packageAction('install')}>Install</button>
      <button onClick = {() => packageAction('uninstall')}>Uninstall</button>
    </>
  )
}

export default App
