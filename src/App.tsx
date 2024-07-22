import { ClarionRoutes } from "./build/ClarionRoutes";
import { CircleMenu  } from "./CircleMenu";
import useClarionEvents from "./build/useClarionEvents";
import { useState } from "react";

function App() {
  const [showMenu, setShowMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });

  useClarionEvents();
  return (
    <div
    style={{ height: "100vh" }}
      onContextMenu={(e) => {
        e.preventDefault();
        console.log("Right click event");
        setShowMenu(true);
        setMenuPosition({ x: e.clientX, y: e.clientY });
      }}
    >
      <header>
        <CircleMenu showMenu={showMenu} setShowMenu={setShowMenu} position={menuPosition} />
      </header>
      <main>
        <section className="section container">
          <ClarionRoutes />
        </section>
      </main>
    </div>
  )
}

export default App
