import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react'
import { clarionDynamicRoutesPlugin } from './clarionDynamicRoutesPlugin';
import { clarionInstallPackagePlugin } from './clarionInstallPackagePlugin';
import { clarionDynamicMenuPlugin } from './clarionDynamicMenuPlugin';
import { clarionDynamicRoutes } from './clarionDynamicRoutes';
import { clarionDynamicMenu } from './clarionDynamicMenu';

export const devSetupPlugin = () => ({
  name: 'dev-setup-plugin',
  configureServer() {
    clarionDynamicRoutes('./package.json', Date.now());
    clarionDynamicMenu('./package.json', Date.now());
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
