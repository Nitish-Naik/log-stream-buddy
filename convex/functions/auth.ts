import { mutation } from "../_generated/server";
import { v } from "convex/values";

export const signUp = mutation({
  args: {
    email: v.string(),
    password: v.string(),
    organization: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if user already exists
    const existingUser = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), args.email))
      .first();

    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    // Create organization first
    const organizationId = await ctx.db.insert("organizations", {
      name: args.organization,
      createdBy: "", // Will be set after user creation
      createdAt: Date.now(),
    });

    // Create user with proper organizationId
    const userId = await ctx.db.insert("users", {
      email: args.email,
      password: args.password, // In production, hash this
      organizationId,
      role: "admin",
      status: "active",
      lastActive: Date.now(),
    });

    // Update organization with creator
    await ctx.db.patch(organizationId, {
      createdBy: userId,
    });

    return { userId, organizationId };
  },
});

export const signIn = mutation({
  args: {
    email: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), args.email))
      .first();

    if (!user || user.password !== args.password) {
      throw new Error("Invalid email or password");
    }

    return { userId: user._id, organizationId: user.organizationId };
  },
});