import { mutation, query } from "../_generated/server";
import { v } from "convex/values";

export const storeLog = mutation({
  args: {
    timestamp: v.number(),
    level: v.union(v.literal("error"), v.literal("warning"), v.literal("info"), v.literal("debug")),
    message: v.string(),
    app_name: v.string(),
    userId: v.id("users"),
    organizationId: v.optional(v.id("organizations")),
    meta: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const logDoc: Record<string, unknown> = {
      timestamp: args.timestamp,
      level: args.level,
      message: args.message,
      app_name: args.app_name,
      userId: args.userId,
      meta: args.meta,
    };

    if (args.organizationId) {
      logDoc.organizationId = args.organizationId;
    }

    const logId = await ctx.db.insert("logs", logDoc);

    return logId;
  },
});

export const getLogs = query({
  args: {
    userId: v.id("users"),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const logs = await ctx.db
      .query("logs")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .order("desc")
      .take(args.limit || 100);

    return logs;
  },
});

export const getLogsByDateRange = query({
  args: {
    userId: v.id("users"),
    startDate: v.number(),
    endDate: v.number(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const logs = await ctx.db
      .query("logs")
      .filter((q) => 
        q.and(
          q.eq(q.field("userId"), args.userId),
          q.gte(q.field("timestamp"), args.startDate),
          q.lte(q.field("timestamp"), args.endDate)
        )
      )
      .order("desc")
      .take(args.limit || 1000);

    return logs;
  },
});

export const getAnalyticsData = query({
  args: {
    userId: v.id("users"),
    days: v.optional(v.number()), // Number of days to look back
  },
  handler: async (ctx, args) => {
    const days = args.days || 7;
    const endDate = Date.now();
    const startDate = endDate - (days * 24 * 60 * 60 * 1000);

    const logs = await ctx.db
      .query("logs")
      .filter((q) => 
        q.and(
          q.eq(q.field("userId"), args.userId),
          q.gte(q.field("timestamp"), startDate),
          q.lte(q.field("timestamp"), endDate)
        )
      )
      .collect();

    // Group logs by date
    const dailyStats = new Map();
    
    logs.forEach(log => {
      const date = new Date(log.timestamp).toISOString().split('T')[0];
      if (!dailyStats.has(date)) {
        dailyStats.set(date, {
          date,
          total: 0,
          error: 0,
          warning: 0,
          info: 0,
          debug: 0,
          apps: new Set()
        });
      }
      
      const stat = dailyStats.get(date);
      stat.total++;
      stat[log.level]++;
      stat.apps.add(log.app_name);
    });

    // Convert to array and sort by date
    const trends = Array.from(dailyStats.values())
      .map(stat => ({
        date: new Date(stat.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        logs: stat.total,
        errors: stat.error,
        warnings: stat.warning,
        apps: stat.apps.size
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Calculate level distribution
    const levelCounts = logs.reduce((acc, log) => {
      acc[log.level] = (acc[log.level] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const totalLogs = logs.length;
    const distribution = [
      { name: 'Info', value: Math.round((levelCounts.info || 0) / totalLogs * 100), count: levelCounts.info || 0 },
      { name: 'Warning', value: Math.round((levelCounts.warning || 0) / totalLogs * 100), count: levelCounts.warning || 0 },
      { name: 'Error', value: Math.round((levelCounts.error || 0) / totalLogs * 100), count: levelCounts.error || 0 },
      { name: 'Debug', value: Math.round((levelCounts.debug || 0) / totalLogs * 100), count: levelCounts.debug || 0 },
    ].filter(item => item.count > 0);

    // Calculate summary stats
    const errorRate = totalLogs > 0 ? ((levelCounts.error || 0) / totalLogs * 100) : 0;
    const totalErrors = levelCounts.error || 0;
    const totalWarnings = levelCounts.warning || 0;

    return {
      trends,
      distribution,
      summary: {
        totalLogs,
        errorRate: Math.round(errorRate * 100) / 100,
        totalErrors,
        totalWarnings,
        days
      }
    };
  },
});

export const getWeeklySummary = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const oneWeekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
    
    const logs = await ctx.db
      .query("logs")
      .filter((q) => 
        q.and(
          q.eq(q.field("userId"), args.userId),
          q.gte(q.field("timestamp"), oneWeekAgo)
        )
      )
      .collect();

    const totalLogs = logs.length;
    const totalErrors = logs.filter(log => log.level === 'error').length;
    const totalWarnings = logs.filter(log => log.level === 'warning').length;
    
    // Group by app/service
    const appStats = logs.reduce((acc, log) => {
      if (!acc[log.app_name]) {
        acc[log.app_name] = { total: 0, errors: 0, warnings: 0 };
      }
      acc[log.app_name].total++;
      if (log.level === 'error') acc[log.app_name].errors++;
      if (log.level === 'warning') acc[log.app_name].warnings++;
      return acc;
    }, {} as Record<string, { total: number; errors: number; warnings: number }>);

    // Sort apps by log volume
    const topApps = Object.entries(appStats)
      .map(([app, stats]) => ({ app, ...stats }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);

    // Calculate peak hours (simplified)
    const hourlyStats = logs.reduce((acc, log) => {
      const hour = new Date(log.timestamp).getHours();
      acc[hour] = (acc[hour] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);

    const peakHour = Object.entries(hourlyStats)
      .sort(([,a], [,b]) => b - a)[0];

    return {
      totalLogs,
      totalErrors,
      totalWarnings,
      topApps,
      peakHour: peakHour ? `${peakHour[0]}:00` : 'N/A',
      appCount: Object.keys(appStats).length
    };
  },
});

export const getLogsStats = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const logs = await ctx.db
      .query("logs")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .collect();

    const totalLogs = logs.length;
    const errorCount = logs.filter(log => log.level === 'error').length;
    const warningCount = logs.filter(log => log.level === 'warning').length;
    const infoCount = logs.filter(log => log.level === 'info').length;
    const debugCount = logs.filter(log => log.level === 'debug').length;

    // Calculate logs per minute rates
    const now = Date.now();
    const fiveMinutesAgo = now - (5 * 60 * 1000);
    const oneHourAgo = now - (60 * 60 * 1000);

    const recentLogs5Min = logs.filter(log => log.timestamp >= fiveMinutesAgo);
    const recentLogs1Hour = logs.filter(log => log.timestamp >= oneHourAgo);

    const logsPerMinuteRecent = recentLogs5Min.length / 5; // Average over 5 minutes
    const logsPerMinute = recentLogs1Hour.length / 60; // Average over 1 hour

    // Get last log timestamp
    const lastLogTimestamp = logs.length > 0 ? Math.max(...logs.map(log => log.timestamp)) : null;

    return {
      totalLogs,
      errorCount,
      warningCount,
      infoCount,
      debugCount,
      errorRate: totalLogs > 0 ? (errorCount / totalLogs * 100) : 0,
      logsPerMinuteRecent,
      logsPerMinute,
      lastLogTimestamp
    };
  },
});

export const getLogsByService = query({
  args: {
    userId: v.id("users"),
    appName: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const logs = await ctx.db
      .query("logs")
      .filter((q) => 
        q.and(
          q.eq(q.field("userId"), args.userId),
          q.eq(q.field("app_name"), args.appName)
        )
      )
      .order("desc")
      .take(args.limit || 100);

    return logs;
  },
});

export const getServiceStats = query({
  args: {
    userId: v.id("users"),
    appName: v.string(),
    days: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const days = args.days || 7;
    const endDate = Date.now();
    const startDate = endDate - (days * 24 * 60 * 60 * 1000);

    const logs = await ctx.db
      .query("logs")
      .filter((q) => 
        q.and(
          q.eq(q.field("userId"), args.userId),
          q.eq(q.field("app_name"), args.appName),
          q.gte(q.field("timestamp"), startDate),
          q.lte(q.field("timestamp"), endDate)
        )
      )
      .collect();

    const totalLogs = logs.length;
    const errorCount = logs.filter(log => log.level === 'error').length;
    const warningCount = logs.filter(log => log.level === 'warning').length;
    const infoCount = logs.filter(log => log.level === 'info').length;
    const debugCount = logs.filter(log => log.level === 'debug').length;

    // Group logs by date for trends
    const dailyStats = new Map();
    
    logs.forEach(log => {
      const date = new Date(log.timestamp).toISOString().split('T')[0];
      if (!dailyStats.has(date)) {
        dailyStats.set(date, {
          date,
          total: 0,
          error: 0,
          warning: 0,
          info: 0,
          debug: 0
        });
      }
      
      const stat = dailyStats.get(date);
      stat.total++;
      stat[log.level]++;
    });

    const trends = Array.from(dailyStats.values())
      .map(stat => ({
        date: new Date(stat.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        logs: stat.total,
        errors: stat.error,
        warnings: stat.warning
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const errorRate = totalLogs > 0 ? (errorCount / totalLogs * 100) : 0;

    return {
      appName: args.appName,
      totalLogs,
      errorCount,
      warningCount,
      infoCount,
      debugCount,
      errorRate: Math.round(errorRate * 100) / 100,
      trends,
      period: `${days} days`
    };
  },
});

export const getAllServices = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const logs = await ctx.db
      .query("logs")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .collect();

    // Get unique app names
    const services = [...new Set(logs.map(log => log.app_name))];

    // Get stats for each service
    const serviceStats = services.map(appName => {
      const appLogs = logs.filter(log => log.app_name === appName);
      const totalLogs = appLogs.length;
      const errorCount = appLogs.filter(log => log.level === 'error').length;
      const warningCount = appLogs.filter(log => log.level === 'warning').length;
      const lastLogTime = appLogs.length > 0 ? Math.max(...appLogs.map(log => log.timestamp)) : null;

      return {
        appName,
        totalLogs,
        errorCount,
        warningCount,
        errorRate: totalLogs > 0 ? Math.round((errorCount / totalLogs) * 10000) / 100 : 0,
        lastActivity: lastLogTime ? new Date(lastLogTime).toISOString() : null
      };
    });

    return serviceStats.sort((a, b) => b.totalLogs - a.totalLogs);
  },
});

export const getLogsByServiceAndDateRange = query({
  args: {
    userId: v.id("users"),
    appName: v.string(),
    startDate: v.number(),
    endDate: v.number(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const logs = await ctx.db
      .query("logs")
      .filter((q) => 
        q.and(
          q.eq(q.field("userId"), args.userId),
          q.eq(q.field("app_name"), args.appName),
          q.gte(q.field("timestamp"), args.startDate),
          q.lte(q.field("timestamp"), args.endDate)
        )
      )
      .order("desc")
      .take(args.limit || 1000);

    return logs;
  },
});

export const clearUserLogs = mutation({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    // Get all logs for the user
    const logs = await ctx.db
      .query("logs")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .collect();

    // Delete all logs for the user
    const deletePromises = logs.map(log => ctx.db.delete(log._id));
    await Promise.all(deletePromises);

    return { deletedCount: logs.length };
  },
});