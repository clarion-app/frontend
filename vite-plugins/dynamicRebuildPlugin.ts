import { dynamicMenu } from "./dynamicMenu";
import { dynamicRoutes } from "./dynamicRoutes";
import { dynamicBackend } from "./dynamicBackend";
import { dynamicStore } from "./dynamicStore";
import { dynamicPackageInitializer } from "./dynamicPackageInitializer";
import { dynamicReverbConfig } from "./dynamicReverbConfig";
import { dynamicEventListeners } from "./dynamicEventListeners";
import { logger } from "../logger";

export const dynamicRebuildPlugin = () => ({
    name: 'clarion-dynamic-menu',
    handleHotUpdate({file, timestamp }) {
      const fileParts = file.split('/');
      const filename = fileParts[fileParts.length - 1];
      if (filename !== 'package.json') return;

      console.log(`${timestamp}: ${file} updated`);
      logger(`${file} updated`);
      dynamicMenu();
      dynamicRoutes();
      dynamicBackend();
      dynamicStore();
      dynamicPackageInitializer();
      dynamicReverbConfig();
      dynamicEventListeners();
    }
  });