import { mutation, query } from "../_generated/server";
import { v } from "convex/values";

// Organization management
export const createOrganization = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {   
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const organizationId = await ctx.db.insert("organizations", {
      name: args.name,
      description: args.description,
      createdBy: identity.subject,
      createdAt: Date.now(),
    });

    return organizationId;
  },
});

// export const getOrganization = query({
//   args: {
//     organizationId: v.id("organizations"),
//   },
//   handler: async (ctx, args) => {
//     const organization = await ctx.db.get(args.organizationId);
//     return organization;
//   },
// });

export const getUserOrganization = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) return null;

    const organization = await ctx.db.get(user.organizationId);
    return organization;
  },
});

// Team member management
export const getTeamMembers = query({
  args: {
    organizationId: v.id("organizations"),
  },
  handler: async (ctx, args) => {
    const members = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("organizationId"), args.organizationId))
      .collect();

    // Get organization info
    const organization = await ctx.db.get(args.organizationId);

    return members.map(member => ({
      ...member,
      organization: organization,
    }));
  },
});

export const updateMemberRole = mutation({
  args: {
    userId: v.id("users"),
    role: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) throw new Error("User not found");

    await ctx.db.patch(args.userId, {
      role: args.role,
    });

    return { success: true };
  },
});

export const removeTeamMember = mutation({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    // Get user to check permissions
    const user = await ctx.db.get(args.userId);
    if (!user) throw new Error("User not found");

    // Remove user from organization by setting status to inactive
    // Note: We can't set organizationId to null/empty since it's a required field
    await ctx.db.patch(args.userId, {
      status: "inactive",
    });

    return { success: true };
  },
});

// Invitation management
export const createInvitation = mutation({
  args: {
    email: v.string(),
    role: v.string(),
    organizationId: v.id("organizations"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    // Check if user is admin of the organization
    const currentUser = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("_id"), identity.subject))
      .first();

    if (!currentUser || currentUser.role !== "admin") {
      throw new Error("Only admins can send invitations");
    }

    // Check if invitation already exists
    const existingInvitation = await ctx.db
      .query("team_invitations")
      .filter((q) =>
        q.and(
          q.eq(q.field("email"), args.email),
          q.eq(q.field("organizationId"), args.organizationId),
          q.eq(q.field("status"), "pending")
        )
      )
      .first();

    if (existingInvitation) {
      throw new Error("Invitation already sent to this email");
    }

    // Generate unique token
    const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

    const invitationId = await ctx.db.insert("team_invitations", {
      email: args.email,
      organizationId: args.organizationId,
      role: args.role,
      invitedBy: identity.subject,
      invitedAt: Date.now(),
      expiresAt: Date.now() + (7 * 24 * 60 * 60 * 1000), // 7 days
      status: "pending",
      token,
    });

    return { invitationId, token };
  },
});

export const getPendingInvitations = query({
  args: {
    organizationId: v.id("organizations"),
  },
  handler: async (ctx, args) => {
    const invitations = await ctx.db
      .query("team_invitations")
      .filter((q) =>
        q.and(
          q.eq(q.field("organizationId"), args.organizationId),
          q.eq(q.field("status"), "pending")
        )
      )
      .collect();

    return invitations;
  },
});

export const acceptInvitation = mutation({
  args: {
    token: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    // Find invitation by token
    const invitation = await ctx.db
      .query("team_invitations")
      .filter((q) => q.eq(q.field("token"), args.token))
      .first();

    if (!invitation) throw new Error("Invalid invitation token");
    if (invitation.status !== "pending") throw new Error("Invitation is no longer valid");
    if (invitation.expiresAt < Date.now()) throw new Error("Invitation has expired");

    // Check if user already exists
    const existingUser = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), invitation.email))
      .first();

    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    // Create new user
    const userId = await ctx.db.insert("users", {
      email: invitation.email,
      password: args.password, // In production, hash this
      organizationId: invitation.organizationId,
      role: invitation.role,
      status: "active",
      invitedAt: invitation.invitedAt,
      invitedBy: invitation.invitedBy,
      lastActive: Date.now(),
    });

    // Update invitation status
    await ctx.db.patch(invitation._id, {
      status: "accepted",
    });

    return { userId };
  },
});

export const cancelInvitation = mutation({
  args: {
    invitationId: v.id("team_invitations"),
  },
  handler: async (ctx, args) => {
    const invitation = await ctx.db.get(args.invitationId);
    if (!invitation) throw new Error("Invitation not found");

    await ctx.db.patch(args.invitationId, {
      status: "cancelled",
    });

    return { success: true };
  },
});

// User registration with organization
export const registerUser = mutation({
  args: {
    email: v.string(),
    password: v.string(),
    organizationName: v.string(),
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

    // Create organization
    const organizationId = await ctx.db.insert("organizations", {
      name: args.organizationName,
      createdBy: "", // Will be set after user creation
      createdAt: Date.now(),
    });

    // Create user
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

// Organization settings management
export const updateOrganizationSettings = mutation({
  args: {
    organizationId: v.id("organizations"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    settings: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    // Check if user is admin of the organization
    const currentUser = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("_id"), identity.subject))
      .first();

    if (!currentUser || currentUser.role !== "admin") {
      throw new Error("Only admins can update organization settings");
    }

    // Get current organization
    const organization = await ctx.db.get(args.organizationId);
    if (!organization) throw new Error("Organization not found");

    // Update organization
    const updates: Record<string, unknown> = {};
    if (args.name !== undefined) updates.name = args.name;
    if (args.description !== undefined) updates.description = args.description;
    if (args.settings !== undefined) {
      updates.settings = {
        ...organization.settings,
        ...args.settings,
      };
    }

    await ctx.db.patch(args.organizationId, updates);

    return { success: true };
  },
});

export const getOrganizationSettings = query({
  args: {
    organizationId: v.id("organizations"),
  },
  handler: async (ctx, args) => {
    const organization = await ctx.db.get(args.organizationId);
    return organization;
  },
});

// Organization statistics
export const getOrganizationStats = query({
  args: {
    organizationId: v.id("organizations"),
  },
  handler: async (ctx, args) => {
    // Get total logs count
    const totalLogs = await ctx.db
      .query("logs")
      .filter((q) => q.eq(q.field("organizationId"), args.organizationId))
      .collect();

    // Get active team members
    const activeMembers = await ctx.db
      .query("users")
      .filter((q) =>
        q.and(
          q.eq(q.field("organizationId"), args.organizationId),
          q.eq(q.field("status"), "active")
        )
      )
      .collect();

    // Get pending invitations
    const pendingInvitations = await ctx.db
      .query("team_invitations")
      .filter((q) =>
        q.and(
          q.eq(q.field("organizationId"), args.organizationId),
          q.eq(q.field("status"), "pending")
        )
      )
      .collect();

    // Calculate average ingestion rate (simplified - in real app would use time-based calculation)
    const avgIngestionRate = totalLogs.length > 0 ? Math.floor(totalLogs.length / 30) : 0; // per day average

    return {
      totalLogs: totalLogs.length,
      activeMembers: activeMembers.length,
      pendingInvitations: pendingInvitations.length,
      avgIngestionRate,
      uptime: 99.9, // Mock data - would calculate from actual uptime monitoring
    };
  },
});

// API Key management (simplified - in production would use proper key management)
export const generateApiKey = mutation({
  args: {
    organizationId: v.id("organizations"),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    // Check if user is admin
    const currentUser = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("_id"), identity.subject))
      .first();

    if (!currentUser || currentUser.role !== "admin") {
      throw new Error("Only admins can generate API keys");
    }

    // Generate a simple API key (in production, use proper crypto)
    const apiKey = `logs_sk_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;

    // Get current organization settings
    const organization = await ctx.db.get(args.organizationId);
    const currentSettings = organization?.settings || {};

    // Add API key to settings
    const apiKeys = currentSettings.apiKeys || [];
    apiKeys.push({
      id: Math.random().toString(36).substring(2, 15),
      name: args.name,
      key: apiKey,
      createdAt: Date.now(),
      lastUsed: null,
    });

    await ctx.db.patch(args.organizationId, {
      settings: {
        ...currentSettings,
        apiKeys,
      },
    });

    return { apiKey };
  },
});

export const getApiKeys = query({
  args: {
    organizationId: v.id("organizations"),
  },
  handler: async (ctx, args) => {
    const organization = await ctx.db.get(args.organizationId);
    return organization?.settings?.apiKeys || [];
  },
});