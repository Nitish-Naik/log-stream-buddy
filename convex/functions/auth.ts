import { mutation } from "../_generated/server";
import { v } from "convex/values";

export const signUp = mutation({
  args: {
    email: v.string(),
    password: v.string(),
    organization: v.string(),
  },
  handler: async (ctx, args) => {
    // For now, we'll use a simple approach
    // In a real app, you'd hash passwords and store users
    const userId = await ctx.db.insert("users", {
      email: args.email,
      organization: args.organization,
      // Note: In production, never store plain text passwords
      password: args.password,
    });

    return { userId };
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

    return { userId: user._id, organization: user.organization };
  },
});