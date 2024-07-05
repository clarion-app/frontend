import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react'
import { clarionInstallPackagePlugin } from './vite-plugins/clarionInstallPackagePlugin';
import { clarionDynamicRebuildPlugin } from './vite-plugins/clarionDynamicRebuildPlugin';
import { clarionDynamicRoutes } from './vite-plugins/clarionDynamicRoutes';
import { clarionDynamicMenu } from './vite-plugins/clarionDynamicMenu';
import { clarionDynamicBackend } from "./vite-plugins/clarionDynamicBackend";

// This plugin is to ensure ClarionRoutes.tsx and ClarionMenu.tsx exist before starting the server
export const devSetupPlugin = () => ({
  name: 'dev-setup-plugin',
  configureServer() {
    clarionDynamicRoutes();
    clarionDynamicMenu();
    clarionDynamicBackend();
  }
});


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    clarionDynamicRebuildPlugin(),
    clarionInstallPackagePlugin(),
    devSetupPlugin()
  ]
})
