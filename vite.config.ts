import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react'
import { clarionDynamicRoutesPlugin } from './clarionDynamicRoutesPlugin';
import { clarionInstallPackagePlugin } from './clarionInstallPackagePlugin';



// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    clarionDynamicRoutesPlugin(),
    clarionInstallPackagePlugin()
  ]
})
