import { ClarionRoutes } from "./build/ClarionRoutes";
import { Menu } from "./Menu";
import useClarionEvents from "./useClarionEvents";

function App() {
  useClarionEvents();
  return (
    <>
      <Menu />
      <ClarionRoutes />
    </>
  )
}

export default App
