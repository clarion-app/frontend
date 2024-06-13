import { ClarionRoutes } from "./ClarionRoutes";

function App() {

  return (
    <>
      <input type="text" id="package" placeholder="Package Name" />
      <button onClick = {() => {
        const packageName = (document.getElementById('package')! as HTMLInputElement).value;
        if (import.meta.hot) import.meta.hot.send('frontend:from-client', { install: packageName });
        }}>Install</button>
      <button onClick = {() => {
        const packageName = (document.getElementById('package')! as HTMLInputElement).value;
        if (import.meta.hot) import.meta.hot.send('frontend:from-client', { uninstall: packageName });
        }}>Uninstall</button>
      <ClarionRoutes />
    </>
  )
}

export default App
