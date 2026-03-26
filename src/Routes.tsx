import { Route, Routes } from "react-router-dom";
import AppManager from "./AppManager";
import Home from "./Home"; 
import { Users } from "./user/Users";
import { NewUser } from "./user/NewUser";
import { Docs } from "./docs/Docs";
import { ImportSpec } from './types';
import { ComponentType } from 'react';

const specs: ImportSpec[] = (await import('./build/components.json', {
  assert: { type: 'json' }
})).default;

const components: Record<string, ComponentType<any>> = {};

await Promise.all(
  specs.map(async ({ componentRoutes, packageName }) => {
    const mod = await import(packageName);
    // prefer default export, fall back to named
    Object.entries(componentRoutes).forEach(([componentName]) => {
      components[componentName] = mod.default ?? mod[componentName];
    });
  })
);

export const ClarionRoutes = () => {
  return (
    <Routes>
      {Object.entries(components).map(([componentName, Component]) => (
        <Route key={componentName} path={componentName} element={<Component />} />
      ))}
      <Route path="/" element={<Home />} />
      <Route path="/app-manager" element={<AppManager />} />
      <Route path="/users" element={<Users />} />
      <Route path="/users/new" element={<NewUser />} />
      <Route path="/docs" element={<Docs />} />
    </Routes>
  );
};