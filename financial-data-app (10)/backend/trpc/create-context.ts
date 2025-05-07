import { initTRPC } from "@trpc/server"

// Create empty context
export const createContext = () => ({})

// Initialize tRPC
const t = initTRPC.context<typeof createContext>().create()

// Export procedures
export const router = t.router
export const publicProcedure = t.procedure
