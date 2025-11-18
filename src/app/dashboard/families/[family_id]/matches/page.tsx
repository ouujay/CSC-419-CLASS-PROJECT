"use client";
import React from "react";
import {
  Users,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Eye,
} from "lucide-react";
import { useSafeQuery } from "@/hooks/useSafeQuery";
import {
  c_GetMatchesByStatus,
  c_ReviewMatch,
} from "@/fullstack/PublicConvexFunctions";
import { useParams } from "next/navigation";
import { ConvexError } from "convex/values";
import { Id } from "@/convex/_generated/dataModel";
import { tryCatch } from "@/utils/try-catch";
import { useMutation } from "convex/react";

export default function FamilyMatchingInterface() {
  const { family_id: familyId } = useParams<{ family_id: Id<"families"> }>();
  const { data, isPending, isError, error } = useSafeQuery(
    c_GetMatchesByStatus,
    {
      familyId: familyId,
    }
  );
  const reviewMatch = useMutation(c_ReviewMatch);

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (isError) {
    const cError = error as ConvexError<string>;
    return <div>{cError.message}</div>;
  }

  const handleMatchReview = async (
    matchId: Id<"family_matches">,
    status: "accepted" | "rejected"
  ) => {
    const {} = tryCatch(reviewMatch({ matchId, status, familyId }));
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return "text-green-600 bg-green-50";
    if (confidence >= 0.6) return "text-yellow-600 bg-yellow-50";
    return "text-red-600 bg-red-50";
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "accepted":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "rejected":
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-yellow-600" />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 ">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Family Member Matching
        </h1>
        <p className="text-foreground">
          Find potential matches for your family members across other family
          trees
        </p>
      </div>

      {/* Match Results */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">
            Potential Matches ({data.length})
          </h2>
        </div>

        {/* Match Cards */}
        <div className="space-y-4">
          {data.map((match) => (
            <div
              key={match._id}
              className="bg-primary/10  border rounded p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-medium text-foreground">
                      {match.otherFamilyMember?.full_name}
                    </h3>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getConfidenceColor(match?.confidence || 0)}`}
                    >
                      {Math.round((match?.confidence || 0) * 100)}% match
                    </span>
                    {getStatusIcon(match?.currentMatch.status || "pending")}
                  </div>

                  <div className="text-sm text-foreground space-y-1">
                    <p>
                      From:{" "}
                      <span className="font-medium">
                        The {match?.otherFamily?.name ?? "Unknown"} Family
                      </span>
                    </p>
                    {match?.otherFamilyMember?.dates?.birth && (
                      <p>Born: {match?.otherFamilyMember?.dates.birth.year}</p>
                    )}
                  </div>
                </div>

                {match.currentMatch.status === "pending" && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleMatchReview(match._id, "accepted")}
                      className="bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 transition-colors"
                      title="Accept Match"
                    >
                      <CheckCircle className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleMatchReview(match._id, "rejected")}
                      className="bg-red-600 text-white p-2 rounded-lg hover:bg-red-700 transition-colors"
                      title="Reject Match"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                    <button className="bg-gray-600 text-white p-2 rounded-lg hover:bg-gray-700 transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Match Details */}
              <div className="space-y-3">
                {/* Match Reasons */}
                <div>
                  <h4 className="text-sm font-medium text-foreground mb-2">
                    Match Reasons:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {match.match_reasons?.map((reason, index) => (
                      <span
                        key={index}
                        className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full"
                      >
                        {reason}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Conflicting Data */}
                {(match?.conflicting_data?.length || 0) > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-foreground mb-2 flex items-center gap-1">
                      <AlertTriangle className="w-4 h-4 text-yellow-600" />
                      Potential Conflicts:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {match?.conflicting_data?.map((conflict, index) => (
                        <span
                          key={index}
                          className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full"
                        >
                          {conflict}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {data.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              No matches found
            </h3>
            <p className="text-foreground max-w-sm mx-auto">
              No pending matches to review. Try running a new search to find
              potential matches.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
