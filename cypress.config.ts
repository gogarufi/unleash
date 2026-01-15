import { defineConfig } from "cypress";

export default defineConfig({
  video: false,
  fixturesFolder: false,
  e2e: {
    setupNodeEvents(_on, _config) {},
    baseUrl: "http://localhost:5173",
  },
});
