// import { useState } from "react";
// import { useMutation, useQuery, useAction } from "convex/react";
// import { api } from "../../../convex/_generated/api";
// import { useAuth } from "@/contexts/AuthContext";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Textarea } from "@/components/ui/textarea";
// import { Badge } from "@/components/ui/badge";
// import { AlertCircle, Brain, Loader2, Search } from "lucide-react";
// import { Alert, AlertDescription } from "@/components/ui/alert";
// import { Id } from "../../../convex/_generated/dataModel";

// interface AIInsightsProps {
//   className?: string;
// }


// export function AIInsights({ className }: AIInsightsProps) {
//   const { user } = useAuth();
//   const [query, setQuery] = useState("");
//   const [isAnalyzing, setIsAnalyzing] = useState(false);
//   const [analysis, setAnalysis] = useState<string | null>(null);

//   // Use the actual AI action via the Convex action hook
//   const analyzeLogs = useAction(api.functions.ai.analyzeLogs);

//   const handleAnalyze = async () => {
//     if (!query.trim() || !user) return;

//     setIsAnalyzing(true);
//     // If no organization is set on the user, continue but warn the user in the UI.
//     // The server-side action accepts an optional organizationId and will fall back to
//     // user-scoped logs when org is not provided.
//     try {
//       // Call the actual AI analysis function
//       type AnalyzeArgs = {
//         userId: Id<"users">;
//         organizationId?: Id<"organizations">;
//         query: string;
//         limit?: number;
//       };

//       const payload: AnalyzeArgs = {
//         userId: user.userId as Id<"users">,
//         query: query.trim(),
//         limit: 100, // Analyze up to 100 recent logs
//       };

//       if (user.organizationId) {
//         payload.organizationId = user.organizationId as Id<"organizations">;
//       }

//       const result = await analyzeLogs(payload);

//       // Format the analysis result
//       const formattedAnalysis = `
// ## AI Log Analysis Results

// **Query:** ${query}

// **Logs Analyzed:** ${result.logCount}

// ---

// ${result.analysis}

// ---

// *Analysis completed at ${new Date(result.timestamp).toLocaleString()}*
//       `;

//       setAnalysis(formattedAnalysis);
//     } catch (error) {
//       console.error("Analysis failed:", error);
//       const errorMessage =
//         error instanceof Error
//           ? error.message
//           : "Analysis failed. Please try again.";
//       setAnalysis(`## Analysis Error

// ${errorMessage}

// Please check your OpenAI API key configuration or try again later.`);
//     } finally {
//       setIsAnalyzing(false);
//     }
//   };

//   return (
//     <Card className={className}>
//       <CardHeader>
//         <CardTitle className="flex items-center gap-2">
//           <Brain className="h-5 w-5 text-primary" />
//           AI Log Analysis
//         </CardTitle>
//         <CardDescription>
//           Get AI-powered insights from your application logs
//         </CardDescription>
//       </CardHeader>
//       <CardContent className="space-y-4">
//         <Alert>
//           <Brain className="h-4 w-4" />
//           <AlertDescription>
//             AI analysis is now active! Ask questions about your logs and get
//             intelligent insights powered by GPT-4.
//           </AlertDescription>
//         </Alert>

//         {!user?.organizationId && (
//           <Alert>
//             <AlertCircle className="h-4 w-4" />
//             <AlertDescription>
//               No organization selected. Analysis will run on your personal/user-scoped logs only.
//             </AlertDescription>
//           </Alert>
//         )}

//         <div className="space-y-2">
//           <label className="text-sm font-medium">
//             What would you like to analyze?
//           </label>
//           <Textarea
//             placeholder="e.g., 'Analyze error patterns from the last 24 hours' or 'Find performance bottlenecks'"
//             value={query}
//             onChange={(e) => setQuery(e.target.value)}
//             className="min-h-[80px]"
//           />
//         </div>

//         <Button
//           onClick={handleAnalyze}
//           disabled={!query.trim() || isAnalyzing}
//           className="w-full"
//         >
//           {isAnalyzing ? (
//             <>
//               <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//               Analyzing...
//             </>
//           ) : (
//             <>
//               <Search className="mr-2 h-4 w-4" />
//               Analyze Logs
//             </>
//           )}
//         </Button>

//         {analysis && (
//           <div className="space-y-2">
//             <div className="flex items-center gap-2">
//               <Badge variant="secondary">Analysis Complete</Badge>
//             </div>
//             <div className="bg-muted p-4 rounded-lg">
//               <div className="prose prose-sm max-w-none dark:prose-invert">
//                 {analysis.split("\n").map((line, index) => {
//                   if (line.startsWith("## ")) {
//                     return (
//                       <h3
//                         key={index}
//                         className="text-lg font-semibold mt-4 mb-2"
//                       >
//                         {line.substring(3)}
//                       </h3>
//                     );
//                   } else if (line.startsWith("### ")) {
//                     return (
//                       <h4 key={index} className="text-md font-medium mt-3 mb-1">
//                         {line.substring(4)}
//                       </h4>
//                     );
//                   } else if (line.startsWith("**")) {
//                     return (
//                       <p key={index} className="font-medium">
//                         {line}
//                       </p>
//                     );
//                   } else if (line.startsWith("- ")) {
//                     return (
//                       <li key={index} className="ml-4">
//                         {line.substring(2)}
//                       </li>
//                     );
//                   } else if (line.trim() === "") {
//                     return <br key={index} />;
//                   } else {
//                     return (
//                       <p key={index} className="mb-1">
//                         {line}
//                       </p>
//                     );
//                   }
//                 })}
//               </div>
//             </div>
//           </div>
//         )}
//       </CardContent>
//     </Card>
//   );
// }
