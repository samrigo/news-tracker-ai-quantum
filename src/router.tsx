import { createHashHistory, createRouter } from "@tanstack/react-router";
import { AppErrorComponent } from "@/lib/error-component";
import { routeTree } from "./routeTree.gen";

export function getRouter() {
  const hash = import.meta.env.VITE_HASH_ROUTER === "1";
  return createRouter({
    routeTree,
    defaultErrorComponent: AppErrorComponent,
    ...(hash ? { history: createHashHistory() } : {}),
  });
}
