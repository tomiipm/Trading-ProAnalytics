import { Hono } from "hono"
import { handle } from "@hono/trpc-server"
import { appRouter } from "./trpc/app-router"
import { createContext } from "./trpc/create-context"

const app = new Hono()

// Add tRPC endpoint
app.use("/trpc/*", async (c) => {
  return handle({
    router: appRouter,
    createContext,
    req: c.req.raw,
    path: c.req.path.replace("/trpc", ""),
  })
})

// Add a simple health check endpoint
app.get("/health", (c) => {
  return c.json({
    status: "ok",
    timestamp: new Date().toISOString(),
  })
})

export default app
