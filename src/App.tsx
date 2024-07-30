import { ClarionRoutes } from "./build/ClarionRoutes";
import { CircleMenu  } from "./CircleMenu";
import useClarionEvents from "./build/useClarionEvents";
import { useState } from "react";
import { useAppSelector } from "./hooks";
import { selectLoggedInUser } from "./user/loggedInUserSlice";
import { selectToken } from "./user/tokenSlice";
import Login from "./user/Login";
import { useUsersExistQuery } from "./user/userApi";
import { NewUser } from "./user/NewUser";

function App() {
  const token = useAppSelector(selectToken);
  const loggedInUser = useAppSelector(selectLoggedInUser);
  const [showMenu, setShowMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const { data: users } = useUsersExistQuery({});

  useClarionEvents();

  if(!token) {
    if(users) {
      return <Login />;
    }
    return <NewUser />;
  }

  return (
    <div
    style={{ height: "100vh" }}
      onContextMenu={(e) => {
        e.preventDefault();
        setShowMenu(true);
        setMenuPosition({ x: e.clientX, y: e.clientY });
      }}
    >
      <header className="header container">
        <h3 className="title">{loggedInUser.name}</h3>
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
