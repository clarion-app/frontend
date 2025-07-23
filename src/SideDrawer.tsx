import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "./hooks";
import { resetAllApiStates } from "./build/store";
import { setToken } from "./user/tokenSlice";
import { setLoggedInUser } from "./user/loggedInUserSlice";
import menuData from "./build/menu.json";
import { MenuDataType } from "./types";

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
    pinnedEntries: ["Home"]
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

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});
  const toggleGroup = (groupKey: string) => {
    setOpenGroups(prev => ({ ...prev, [groupKey]: !prev[groupKey] }));
  };

  return (
    <div className={`side-drawer ${isOpen ? "open" : ""}`}>
      {keys.map((key) => {
        const entryKeys = Object.keys(menu[key].entries);
        const pinned = menu[key].pinnedEntries || [];
        const pinnedKeys = entryKeys.filter(e => pinned.includes(e));
        const otherKeys = entryKeys.filter(e => !pinned.includes(e));
        const isGroupOpen = !!openGroups[key];

        // single-entry remains unchanged
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

        return (
          <div key={key}>
            <h4
              className="submenu-title"
              onClick={() => toggleGroup(key)}
            >
              {menu[key].name}
            </h4>
            {pinnedKeys.map(entry => (
              <button
                key={entry}
                onClick={() => handleItemClick(menu[key].entries[entry])}
                className="menu-item"
              >
                {entry}
              </button>
            ))}
            {isGroupOpen && otherKeys.map(entry => (
              <button
                key={entry}
                onClick={() => handleItemClick(menu[key].entries[entry])}
                className="menu-item"
              >
                {entry}
              </button>
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
