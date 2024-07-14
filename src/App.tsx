import { ClarionRoutes } from "./build/ClarionRoutes";
import { Menu } from "./Menu";
import useClarionEvents from "./build/useClarionEvents";

function App() {
  useClarionEvents();
  return (
    <div className="container">
      <header>
        <Menu />
      </header>
      <main>
        <ClarionRoutes />
      </main>
    </div>
  )
}

export default App
