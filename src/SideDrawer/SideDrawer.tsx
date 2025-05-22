import React from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../hooks";
import { resetAllApiStates } from "../build/store";
import { setToken } from "../user/tokenSlice";
import { setLoggedInUser } from "../user/loggedInUserSlice";
import menuData from "../build/menu.json";
import { MenuDataType } from "../types";
import { NavButton } from "./NavButton";
import "./SideDrawer.css";

interface SideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SideDrawer: React.FC<SideDrawerProps> = ({ isOpen, onClose }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const menu: MenuDataType = menuData;

  const keys = Object.keys(menu).sort();
  if(keys.includes("@clarion-app/frontend")) {
    keys.splice(keys.indexOf("@clarion-app/frontend"), 1);
  }
  keys.unshift("@clarion-app/frontend");


  menu["@clarion-app/frontend"] = {
    name: "Clarion",
    entries: {
      Home: "/",
      "App Manager": "/app-manager",
      Users: "/users",
      "New User": "/users/new",
      Docs: "/docs",
    },
  };

  const handleItemClick = (path: string) => {
    onClose();
    navigate(path);
  };

  const logout = () => {
    resetAllApiStates(); 
    dispatch(setToken(""));
    dispatch(setLoggedInUser({ id: "", name: "", email: "" }));
    onClose();
  };

  return (
    <div className={`side-drawer ${isOpen ? "open" : ""}`}>
      {keys.map((key) => {
        const entryKeys = Object.keys(menu[key].entries);
        
        // If there's only one entry, we can show it directly
        if (entryKeys.length === 1) {
          const label = entryKeys[0];
          const path = menu[key].entries[label];
          return (
            <div key={path}>
              <h4
                className="submenu-title"
                onClick={() => handleItemClick(path)}
              >
                {label}
              </h4>
            </div>
          );
        }

        // Otherwise, let's list them as a group
        return (
          <div key={key}>
            <h4 className="submenu-title">{menu[key].name}</h4>
            {entryKeys.map((entry) => (
              <NavButton
                key={entry}
                onClick={() => handleItemClick(menu[key].entries[entry])}
              >
                {entry}
              </NavButton>
            ))}
          </div>
        );
      })}

      <button onClick={logout} className="menu-item logout-btn">
        Logout
      </button>
    </div>
  );
};
