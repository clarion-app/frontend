import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react'
import { installPackagePlugin } from './vite-plugins/installPackagePlugin';
import { dynamicRebuildPlugin } from './vite-plugins/dynamicRebuildPlugin';
import { dynamicRoutes } from './vite-plugins/dynamicRoutes';
import { dynamicMenu } from './vite-plugins/dynamicMenu';
import { dynamicBackend } from "./vite-plugins/dynamicBackend";
import { dynamicStore } from './vite-plugins/dynamicStore';
import { dynamicPackageInitializer } from './vite-plugins/dynamicPackageInitializer';

// This plugin is to ensure ClarionRoutes.tsx and ClarionMenu.tsx exist before starting the server
export const devSetupPlugin = () => ({
  name: 'dev-setup-plugin',
  configureServer() {
    dynamicRoutes();
    dynamicMenu();
    dynamicBackend();
    dynamicStore();
    dynamicPackageInitializer();
  }
});


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    dynamicRebuildPlugin(),
    installPackagePlugin(),
    devSetupPlugin()
  ]
})
