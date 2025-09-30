import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    email: v.string(),
    password: v.string(), // Note: In production, store hashed passwords
    organization: v.string(),
  }),
  logs: defineTable({
    timestamp: v.number(), // Unix timestamp
    level: v.union(v.literal("error"), v.literal("warning"), v.literal("info"), v.literal("debug")),
    message: v.string(),
    app_name: v.string(),
    userId: v.string(), // Reference to the user who owns this log
    organization: v.string(), // Organization name for filtering
    meta: v.optional(v.any()), // Additional metadata
  }),
});