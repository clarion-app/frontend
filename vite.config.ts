import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react'
import { clarionDynamicRoutesPlugin } from './vite-plugins/clarionDynamicRoutesPlugin';
import { clarionInstallPackagePlugin } from './vite-plugins/clarionInstallPackagePlugin';
import { clarionDynamicMenuPlugin } from './vite-plugins/clarionDynamicMenuPlugin';
import { clarionDynamicRoutes } from './vite-plugins/clarionDynamicRoutes';
import { clarionDynamicMenu } from './vite-plugins/clarionDynamicMenu';

// This plugin is to ensure ClarionRoutes.tsx and ClarionMenu.tsx exist before starting the server
export const devSetupPlugin = () => ({
  name: 'dev-setup-plugin',
  configureServer() {
    clarionDynamicRoutes();
    clarionDynamicMenu();
  }
});


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    clarionDynamicRoutesPlugin(),
    clarionInstallPackagePlugin(),
    clarionDynamicMenuPlugin(),
    devSetupPlugin()
  ]
})
