import { clarionDynamicRoutes } from './clarionDynamicRoutes';

export const clarionDynamicRoutesPlugin = () => ({
    name: 'clarion-dynamic-routes',
    handleHotUpdate({file, timestamp }) {
      clarionDynamicRoutes(file, timestamp);
    }
  });