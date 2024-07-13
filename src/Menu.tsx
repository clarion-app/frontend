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

menu['@clarion-app/frontend'] = {
  name: 'Clarion',
  entries: {
    'Home': '/',
    'App Manager': '/app-manager'
  }
};

export const Menu = () => {
  const keys = Object.keys(menu).sort();
  return (
    <div className="menu">
      {keys.map((packageName) => {
        const packageMenu = menu[packageName];
        return (
          <div className="packageMenu" key={packageName}>
            <h2>{packageMenu.name}</h2>
            {Object.keys(packageMenu.entries).map((entry) => {
              return (
                <a key={entry} href={packageMenu.entries[entry]}>{entry}</a>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};
