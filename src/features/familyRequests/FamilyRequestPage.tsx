"use client";
import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Clock,
  Eye,
  Edit,
  Shield,
  MessageSquare,
  Loader2,
  Filter,
  Inbox,
} from "lucide-react";
import { useSafeQuery } from "@/hooks/useSafeQuery";
import {
  c_GetFamilyRequestsByFamilyId,
  c_RespondToRequest,
} from "@/fullstack/PublicConvexFunctions";
import { Id } from "@/convex/_generated/dataModel";
import { GetFamilyRequest } from "@/fullstack/types";
import { useMutation } from "convex/react";
import { tryCatch } from "@/utils/try-catch";
import { toast } from "sonner";
import { formatTimeAgo } from "@/utils/utils";

type statusType = GetFamilyRequest["status"];
const FamilyRequestCard = ({
  familyRequest,
}: {
  familyRequest: GetFamilyRequest;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const respondToRequest = useMutation(c_RespondToRequest);
  const requestResponse = async (action: "accepted" | "rejected") => {
    const { error } = await tryCatch(
      respondToRequest({
        status: action,
        requestId: familyRequest._id,
        familyId: familyRequest.to.family_id,
        eventType: "update_family_request",
      })
    );

    if (error) {
      console.error(error);
      toast.error("Failed to respond to request.");
      setIsLoading(false);
      return;
    }

    toast.success("Family request responded successfully.");
    setIsLoading(false);
  };

  const getStatusBadgeVariant = (status: statusType) => {
    switch (status) {
      case "accepted":
        return "default";
      case "rejected":
        return "destructive";
      case "pending":
        return "secondary";
      default:
        return "secondary";
    }
  };

  const getPermissionIcon = (permission: GetFamilyRequest["permission"]) => {
    switch (permission) {
      case "viewer":
        return <Eye className="h-3 w-3" />;
      case "editor":
        return <Edit className="h-3 w-3" />;
      case "limited":
        return <Shield className="h-3 w-3" />;
      default:
        return <Eye className="h-3 w-3" />;
    }
  };

  const getTypeLabel = (type: GetFamilyRequest["type"]) => {
    switch (type) {
      case "extend":
        return "Family Extension Request";
      case "connect":
        return "Family Connection Request";
      case "collaborate":
        return "Collaboration Request";
      default:
        return "Family Request";
    }
  };

  const getUserInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <Card className="w-full border">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src="" alt={familyRequest.fromUserName} />
              <AvatarFallback className="bg-primary  font-medium">
                {getUserInitials(familyRequest.fromUserName)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="font-semibold text-sm">
                {familyRequest.fromUserName}
              </h3>
              <p className="text-xs">{getTypeLabel(familyRequest.type)}</p>
            </div>
          </div>
          <Badge
            variant={getStatusBadgeVariant(familyRequest.status)}
            className="text-xs"
          >
            {familyRequest.status.charAt(0).toUpperCase() +
              familyRequest.status.slice(1)}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-3">
          {/* Permission Level */}
          <div className="flex items-center gap-2 text-sm">
            {getPermissionIcon(familyRequest.permission)}
            <span className=" capitalize">
              {familyRequest.permission} access
            </span>
          </div>

          {/* Message */}
          {familyRequest.message && (
            <div className="bg-primary/10 rounded p-3">
              <div className="flex items-start gap-2">
                <MessageSquare className="h-4 w-4 text-secondary mt-0.5 flex-shrink-0" />
                <p className="text-sm  leading-relaxed">
                  {familyRequest.message}
                </p>
              </div>
            </div>
          )}

          {/* Timestamp */}
          <div className="flex items-center gap-2 text-xs text-secondary">
            <Clock className="h-3 w-3" />
            <span>{formatTimeAgo(familyRequest._creationTime)}</span>
          </div>

          {/* Action buttons - only show for pending requests */}
          {familyRequest.status === "pending" && (
            <div className="flex gap-2 pt-2">
              <Button
                size="sm"
                className="flex-1"
                disabled={isLoading}
                onClick={() => requestResponse("accepted")}
              >
                Accept
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="flex-1"
                disabled={isLoading}
                onClick={() => requestResponse("rejected")}
              >
                Decline
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// Example usage with multiple requests
const FamilyRequestsList = ({ familyId }: { familyId: Id<"families"> }) => {
  const [activeFilter, setActiveFilter] = useState<statusType | "all">("all");
  const { data: familyRequests, isPending } = useSafeQuery(
    c_GetFamilyRequestsByFamilyId,
    { familyId }
  );

  const filteredRequests =
    activeFilter === "all"
      ? familyRequests
      : familyRequests?.filter((request) => request.status === activeFilter) ||
        [];

  const getFilterCount = (status: statusType | "all") => {
    if (status === "all") return familyRequests?.length || 0;
    return familyRequests?.filter((request) => request.status === status)
      .length;
  };

  const filterButtons = [
    { key: "all", label: "All", variant: "default" },
    { key: "pending", label: "Pending", variant: "secondary" },
    { key: "accepted", label: "Accepted", variant: "default" },
    { key: "rejected", label: "Rejected", variant: "destructive" },
  ] as const;

  return (
    <div className="max-w-5xl mx-auto p-4">
      <div className="mb-6">
        <h4 className="mb-2">Family Requests</h4>
        <p className="">Manage your incoming family requests</p>
      </div>
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Filter className="h-4 w-4 text-secondary" />
          <span className="text-sm font-medium ">Filter by status:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {filterButtons.map((filter) => (
            <Button
              key={filter.key}
              onClick={() => setActiveFilter(filter.key)}
              variant={activeFilter === filter.key ? filter.variant : "outline"}
              size="sm"
              className="relative"
            >
              {filter.label}
              <Badge
                variant="secondary"
                className="ml-2 text-xs px-1.5 py-0 h-5 bg-white/20 text-current border-0"
              >
                {getFilterCount(filter.key)}
              </Badge>
            </Button>
          ))}
        </div>
      </div>
      <div className="grid sm:grid-cols-fluid-xl gap-4">
        {filteredRequests?.map((request) => (
          <FamilyRequestCard key={request._id} familyRequest={request} />
        ))}
      </div>

      {filteredRequests?.length === 0 && (
        <div className="text-center py-12">
          <Inbox className="h-12 w-12  mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No requests yet</h3>
          <p className="">Family requests will appear here</p>
        </div>
      )}

      {isPending && (
        <div className="text-center py-12">
          <Loader2 className="h-12 w-12  mx-auto mb-4 animate-spin" />
          <h3 className="text-lg font-medium mb-2">Loading...</h3>
        </div>
      )}
    </div>
  );
};

export default FamilyRequestsList;
