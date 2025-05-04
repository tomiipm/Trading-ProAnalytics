import { publicProcedure } from "../../../create-context";

export const hiProcedure = publicProcedure.query(() => {
  return {
    greeting: "Hello from tRPC!",
    timestamp: new Date().toISOString(),
  };
});