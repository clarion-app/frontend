import { clarionDynamicMenu } from "./clarionDynamicMenu";
import { logger } from "../logger";

export const clarionDynamicMenuPlugin = () => ({
    name: 'clarion-dynamic-menu',
    handleHotUpdate({file, timestamp }) {
      const fileParts = file.split('/');
      const filename = fileParts[fileParts.length - 1];
      if (filename !== 'package.json') return;

      console.log(`${timestamp}: ${file} updated`);
      logger(`${file} updated`);
      clarionDynamicMenu();
    }
  });