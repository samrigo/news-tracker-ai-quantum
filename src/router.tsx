import {
  createHashHistory,
  createMemoryHistory,
  createRouter,
} from "@tanstack/react-router";
import { AppErrorComponent } from "@/lib/error-component";
import { routeTree } from "./routeTree.gen";

export function getRouter() {
  const wantHash = import.meta.env.VITE_HASH_ROUTER === "1";
  const isBrowser = typeof document !== "undefined";

  return createRouter({
    routeTree,
    defaultErrorComponent: AppErrorComponent,
    ...(wantHash
      ? {
          history: isBrowser
            ? createHashHistory()
            : createMemoryHistory({ initialEntries: ["/"] }),
        }
      : {}),
  });
}
