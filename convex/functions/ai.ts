// import { action } from "../_generated/server";
// import { v } from "convex/values";
// import { api } from "../_generated/api";
// import OpenAI from "openai";

// // Minimal log entry shape used in these functions
// type LogEntry = { timestamp: number; level: string; message: string; [key: string]: unknown };

// // Initialize OpenAI client only if API key is available.
// // We try, in order:
// // 1) process.env.OPENAI_API_KEY
// // 2) a local file at convex/secrets.local.ts exporting `OPENAI_API_KEY` (for local dev only)
// // Note: Do NOT commit your real key. Use the template `convex/secrets.local.ts` and add the
// // file to .gitignore (we create a template below).
// let openai: OpenAI | null = null;

// async function tryImportLocal() {
//   try {
//   const mod = await import("../secrets.local");
//   return mod?.OPENAI_API_KEY;
//   } catch (e) {
//     return undefined;
//   }
// }

// (async () => {
//   const localKey = await tryImportLocal();
//   const apiKey = process.env.OPENAI_API_KEY || localKey;
//   if (apiKey) {
//     openai = new OpenAI({ apiKey });
//   }
// })();

// export const analyzeLogs = action({
//   args: {
//     userId: v.id("users"),
//     organizationId: v.optional(v.id("organizations")),
//     query: v.string(),
//     timeRange: v.optional(
//       v.object({
//         start: v.number(),
//         end: v.number(),
//       })
//     ),
//     limit: v.optional(v.number()),
//   },
//   handler: async (ctx, args) => {
//     if (!openai) {
//       throw new Error(
//         "OpenAI API key not configured. Please set the OPENAI_API_KEY environment variable."
//       );
//     }

//     // Fetch relevant logs
//     let logs: LogEntry[] = [];
//     if (args.timeRange) {
//       logs = await ctx.runQuery(api.functions.logs.getLogsByDateRange, {
//         userId: args.userId,
//         startDate: args.timeRange.start,
//         endDate: args.timeRange.end,
//         limit: args.limit || 100,
//       });
//     } else {
//       logs = await ctx.runQuery(api.functions.logs.getLogs, {
//         userId: args.userId,
//         limit: args.limit || 100,
//       });
//     }

//     const logText = logs
//       .map((log: LogEntry) =>
//         `[${new Date(log.timestamp).toISOString()}] ${log.level.toUpperCase()}: ${log.message}`
//       )
//       .join("\n");

//     const prompt = `Analyze these application logs and provide insights:\n\nQuery: ${args.query}\n\nLogs:\n${logText}\n\nPlease provide:\n1. Summary of the log activity\n2. Any errors or issues identified\n3. Patterns or trends observed\n4. Recommendations for improvement\n5. Severity assessment (Low/Medium/High/Critical)`;

//     const completion = await openai.chat.completions.create({
//       model: "gpt-4",
//       messages: [
//         {
//           role: "system",
//           content:
//             "You are an expert log analyst. Analyze application logs and provide actionable insights.",
//         },
//         { role: "user", content: prompt },
//       ],
//       max_tokens: 1000,
//       temperature: 0.3,
//     });

//     const analysis = completion.choices[0]?.message?.content || "Analysis failed";

//     return {
//       analysis,
//       logCount: logs.length,
//       timestamp: Date.now(),
//     };
//   },
// });

// export const detectAnomalies = action({
//   args: {
//     userId: v.id("users"),
//     organizationId: v.optional(v.id("organizations")),
//     hours: v.optional(v.number()), // Look back hours, default 24
//   },
//   handler: async (ctx, args) => {
//     if (!openai) {
//       throw new Error(
//         "OpenAI API key not configured. Please set the OPENAI_API_KEY environment variable."
//       );
//     }

//     const hours = args.hours || 24;
//     const startTime = Date.now() - hours * 60 * 60 * 1000;

//     const logs: LogEntry[] = await ctx.runQuery(api.functions.logs.getLogsByDateRange, {
//       userId: args.userId,
//       startDate: startTime,
//       endDate: Date.now(),
//       limit: 500,
//     });

//     const errorLogs = logs.filter((log: LogEntry) => log.level === "error");
//     const warningLogs = logs.filter((log: LogEntry) => log.level === "warning");

//     const anomalyPrompt = `Analyze these logs for anomalies and potential issues:\n\nTotal logs: ${logs.length}\nError logs: ${errorLogs.length}\nWarning logs: ${warningLogs.length}\n\nError patterns:\n${errorLogs
//       .slice(0, 20)
//       .map((log: LogEntry) => `- ${log.message}`)
//       .join("\n")}\n\nWarning patterns:\n${warningLogs
//       .slice(0, 20)
//       .map((log: LogEntry) => `- ${log.message}`)
//       .join("\n")}\n\nIdentify:\n1. Unusual error patterns\n2. Potential security issues\n3. Performance problems\n4. System health indicators\n5. Recommended actions`;

//     const completion = await openai.chat.completions.create({
//       model: "gpt-4",
//       messages: [
//         {
//           role: "system",
//           content:
//             "You are a cybersecurity and systems expert. Analyze logs for anomalies, security issues, and system health.",
//         },
//         { role: "user", content: anomalyPrompt },
//       ],
//       max_tokens: 800,
//       temperature: 0.2,
//     });

//     const analysis = completion.choices[0]?.message?.content || "Anomaly detection failed";

//     return {
//       analysis,
//       totalLogs: logs.length,
//       errorCount: errorLogs.length,
//       warningCount: warningLogs.length,
//       timeRange: { start: startTime, end: Date.now() },
//     };
//   },
// });
    