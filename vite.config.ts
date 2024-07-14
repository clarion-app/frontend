import fs from 'fs';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths';
import { installPackagePlugin } from './vite-plugins/installPackagePlugin';
import { dynamicRebuildPlugin } from './vite-plugins/dynamicRebuildPlugin';
import { dynamicRoutes } from './vite-plugins/dynamicRoutes';
import { dynamicMenu } from './vite-plugins/dynamicMenu';
import { dynamicBackend } from "./vite-plugins/dynamicBackend";
import { dynamicStore } from './vite-plugins/dynamicStore';
import { dynamicPackageInitializer } from './vite-plugins/dynamicPackageInitializer';
import { dynamicReverbConfig } from './vite-plugins/dynamicReverbConfig';
import { dynamicEventListeners } from './vite-plugins/dynamicEventListeners';

// This plugin is to ensure ClarionRoutes.tsx and ClarionMenu.tsx exist before starting the server
export const devSetupPlugin = () => ({
  name: 'dev-setup-plugin',
  configureServer() {
    if (!fs.existsSync('./src/build')) {
      fs.mkdirSync('./src/build');
    }
    if(!fs.existsSync('./src/build/store')) {
      fs.mkdirSync('./src/build/store');
    }
    dynamicRoutes();
    dynamicMenu();
    dynamicBackend();
    dynamicStore();
    dynamicPackageInitializer();
    dynamicReverbConfig();
    dynamicEventListeners();
  }
});


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
    dynamicRebuildPlugin(),
    installPackagePlugin(),
    devSetupPlugin()
  ]
})
