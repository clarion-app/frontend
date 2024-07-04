import { clarionDynamicMenu } from "./clarionDynamicMenu";

export const clarionDynamicMenuPlugin = () => ({
    name: 'clarion-dynamic-menu',
    handleHotUpdate({file, timestamp }) {
      clarionDynamicMenu(file, timestamp);
    }
  });