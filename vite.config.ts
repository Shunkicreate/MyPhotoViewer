import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    remix({
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
      },
      basename: "/",
      buildDirectory: "build",
      routes(defineRoutes) {
        return defineRoutes((route) => {
          route("/:year", "routes/$year.tsx");
          route("/:year/:month", "routes/$year/$month.tsx");
          route("/:year/:month/:photoName", "routes/$year/$month/$photo.tsx");
        });
      },
    }),
    tsconfigPaths(),
  ],
});
