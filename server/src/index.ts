import { app } from "./app.ts";
import { env } from "./config.ts";

export const server = app.listen(env.PORT, () => {
  console.log(`Server listening on port ${env.PORT}`);
});
