import React from "react";
import { useNavigate } from "react-router-dom";
import { Menu, MenuItem, SubMenu } from "@spaceymonk/react-radial-menu";
import { useAppDispatch } from "./hooks";
import { resetAllApiStates } from './build/store';
import { setLoggedInUser } from "./user/loggedInUserSlice";
import { setToken } from "./user/tokenSlice";
import menuData from "./build/menu.json";
import { MenuDataType } from "./types";

const menu: MenuDataType = menuData;
const keys = Object.keys(menu).sort();
keys.unshift("@clarion-app/frontend");

menu["@clarion-app/frontend"] = {
  name: "Clarion",
  entries: {
    "Home": "/",
    "App Manager": "/app-manager",
    "Users": "/users",
    "New User": "/users/new",
    "Docs": "/docs",
  },
};

interface CircleMenuPropsType {
  showMenu: boolean;
  setShowMenu: Function;
  position: { x: number; y: number };
}

export const CircleMenu: React.FC<CircleMenuPropsType> = (props: CircleMenuPropsType) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  
  const logout = () => {
    resetAllApiStates();
    dispatch(setToken(""));
    dispatch(setLoggedInUser({ name: "", email: ""}));
  };

  const handleItemClick = (
    _event: React.MouseEvent,
    _index: number,
    data: string
  ) => {
    props.setShowMenu(false);
    navigate(data);
  };
  const handleSubMenuClick = (
    _event: React.MouseEvent,
    _index: number,
    data: string
  ) => {
    console.log(`[SubMenu] ${data} clicked`);
  };
  const handleDisplayClick = (_event: React.MouseEvent, position: string) => {
    console.log(`[Display] ${position} clicked`);
  };


  return (
    <div
      onClick={() => props.setShowMenu(false)}
    >
      <Menu
        centerX={props.position.x}
        centerY={props.position.y}
        innerRadius={75}
        outerRadius={150}
        show={props.showMenu}
        animation={["fade", "scale"]}
        animationTimeout={150}
        drawBackground
      >
        {keys.map((key) => {
          if (Object.keys(menu[key].entries).length == 1) {
            return (
              <MenuItem
                key={menu[key].entries[Object.keys(menu[key].entries)[0]]}
                onItemClick={handleItemClick}
                data={menu[key].entries[Object.keys(menu[key].entries)[0]]}
              >
                {Object.keys(menu[key].entries)[0]}
              </MenuItem>
            );
          }

          return (
            <SubMenu
              key={key}
              onDisplayClick={handleDisplayClick}
              onItemClick={handleSubMenuClick}
              itemView={menu[key].name}
              data={key}
              displayPosition="bottom"
            >
              {Object.keys(menu[key].entries).map((entry) => (
                <MenuItem
                  key={entry}
                  onItemClick={handleItemClick}
                  data={menu[key].entries[entry]}
                >
                  {entry}
                </MenuItem>
              ))}
            </SubMenu>
          );
        })}
        <MenuItem
          onItemClick={() => {
            logout();
          }}
        >
          Logout
        </MenuItem>
      </Menu>
    </div>
  );
};
