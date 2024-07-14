import menuData from './build/menu.json';

interface MenuData {
  [key: string]: {
    name: string;
    entries: {
      [key: string]: string;
    };
  };
}

const menu: MenuData = menuData;
const keys = Object.keys(menu).sort();
keys.unshift('@clarion-app/frontend');

menu['@clarion-app/frontend'] = {
  name: 'Clarion',
  entries: {
    'Home': '/',
    'App Manager': '/app-manager'
  }
};

export const Menu = () => {
  return (
    <div className="menu">
      {keys.map((packageName) => {
        const packageMenu = menu[packageName];
        return (
          <div key={packageName} className="mt-4">
            <p className="menu-label">{packageMenu.name}</p>
            <ul className="menu-list">
            {Object.keys(packageMenu.entries).map((entry) => {
              return (
                <li key={entry}>
                  <a href={packageMenu.entries[entry]}>{entry}</a>
                </li>
              );
            })}
            </ul>
          </div>
        );
      })}
    </div>
  );
};
