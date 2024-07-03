import { ClarionRoutes } from "./ClarionRoutes";
import { ClarionMenu } from "./ClarionMenu";

const packageAction = (action: string, packageName: string) => {
  if (!import.meta.hot) return;
  if(packageName.length === 0) return;
  import.meta.hot.send('frontend:from-client', { [action]: packageName }); 
}

function App() {
  return (
    <>
      <ClarionMenu />
      <input type="text" id="package" placeholder="Package Name" />
      <button onClick = {() => {
        const packageName = (document.getElementById('package') as HTMLInputElement).value;
        packageAction('install', packageName);
        }}>Install</button>
      <button onClick = {() => {
        const packageName = (document.getElementById('package') as HTMLInputElement).value;
        packageAction('uninstall', packageName);
        }}>Uninstall</button>
      <ClarionRoutes />
    </>
  )
}

export default App
