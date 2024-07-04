import { clarionDynamicRoutes } from './clarionDynamicRoutes';
import { logger } from "../logger";

export const clarionDynamicRoutesPlugin = () => ({
    name: 'clarion-dynamic-routes',
    handleHotUpdate({file, timestamp }) {
      const fileParts = file.split('/');
      const filename = fileParts[fileParts.length - 1];
      if (filename !== 'package.json') return;

      console.log(`${timestamp}: ${file} updated`);
      logger(`${file} updated`);
      clarionDynamicRoutes();
    }
  });