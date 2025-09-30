import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  organizations: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    createdBy: v.string(), // userId of the creator
    createdAt: v.number(),
    settings: v.optional(v.any()), // Organization settings
  }),
  users: defineTable({
    email: v.string(),
    password: v.string(), // Note: In production, store hashed passwords
    organizationId: v.optional(v.id("organizations")), // Reference to organization - temporarily optional
    organization: v.optional(v.string()), // Legacy field - temporarily optional
    role: v.optional(v.string()), // admin, developer, viewer - temporarily optional
    status: v.optional(v.string()), // active, inactive, pending - temporarily optional
    invitedAt: v.optional(v.number()),
    invitedBy: v.optional(v.string()), // User ID as string
    lastActive: v.optional(v.number()),
  }),
  team_invitations: defineTable({
    email: v.string(),
    organizationId: v.id("organizations"),
    role: v.string(),
    invitedBy: v.string(), // User ID as string
    invitedAt: v.number(),
    expiresAt: v.number(),
    status: v.string(), // pending, accepted, expired, cancelled
    token: v.string(), // Unique token for invitation link
  }),
  logs: defineTable({
    timestamp: v.number(), // Unix timestamp
    level: v.union(v.literal("error"), v.literal("warning"), v.literal("info"), v.literal("debug")),
    message: v.string(),
    app_name: v.string(),
    userId: v.id("users"), // Reference to the user who owns this log
    organizationId: v.optional(v.id("organizations")), // Reference to organization
    organization: v.optional(v.string()), // Legacy field - to be migrated
    meta: v.optional(v.any()), // Additional metadata
  }),
});