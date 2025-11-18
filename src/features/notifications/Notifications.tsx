"use client";
import React, { JSX, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Bell,
  Clock,
  ExternalLink,
  Check,
  Mail,
  MessageSquare,
  Loader2,
  UserSearch,
  UserPlus,
  Handshake,
} from "lucide-react";
import { useSafeQuery } from "@/hooks/useSafeQuery";
import {
  c_GetNotificationsByUser,
  c_MarkNotificationAsRead,
} from "@/fullstack/PublicConvexFunctions";
import { notificationOptions } from "@/convex/tables";
import { z } from "zod";
import { formatTimeAgo } from "@/utils/utils";
import Link from "next/link";
import { useMutation } from "convex/react";
import { tryCatch } from "@/utils/try-catch";
import { toast } from "sonner";
import { Doc } from "@/convex/_generated/dataModel";
import { ConvexError } from "convex/values";
import { redirect } from "next/navigation";

type notificationTypes = z.infer<typeof notificationOptions>;
const NotificationCard = ({
  notification,
}: {
  notification: Doc<"notifications">;
}) => {
  const [isRead, setIsRead] = useState(notification.is_read);
  const markAsRead = useMutation(c_MarkNotificationAsRead);

  const getNotificationIcon = (type: notificationTypes) => {
    const iconMap: Record<notificationTypes, JSX.Element> = {
      family_extension_request: <UserSearch className="h-4 w-4" />,
      family_member_connection_request: <UserPlus className="h-4 w-4" />,
      collaboration_request: <Mail className="h-4 w-4" />,
      family_member_match: <Handshake className="h-4 w-4" />,
      family_request_response: <MessageSquare className="h-4 w-4" />,
    };

    return iconMap[type] || <Bell className="h-4 w-4" />;
  };

  const getTypeLabel = (type: notificationTypes) => {
    const labelMap: Record<notificationTypes, string> = {
      family_extension_request: "Family Update",
      family_member_connection_request: "Message",
      collaboration_request: "Invitation",
      family_member_match: "Reminder",
      family_request_response: "System",
    };

    return labelMap[type] || "Notification";
  };

  const handleMarkAsRead = async () => {
    setIsRead(true);

    const { error } = await tryCatch(
      markAsRead({
        notificationId: notification._id,
      })
    );

    if (error) {
      const cError = error as ConvexError<string>;
      toast.error(cError.data);
      console.error("Failed to mark notification as read");
      setIsRead(false);
    }
  };

  const handleClick = async () => {
    if (!isRead) {
      setIsRead(true);

      const { error } = await tryCatch(
        markAsRead({
          notificationId: notification._id,
        })
      );

      if (error) {
        const cError = error as ConvexError<string>;
        toast.error(cError.data);
        console.error("Failed to mark notification as read");
        setIsRead(false);
      }
    }
    if (notification.link) {
      redirect(notification.link);
    }
  };

  return (
    <Card
      className={`w-full border-primary transition-all duration-200 cursor-pointer hover:shadow-md ${
        isRead ? "border-1 opacity-75" : "border-2 shadow-sm"
      }`}
      onClick={handleClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          {/* Notification Icon */}
          <div className={`p-2 rounded-full flex-shrink-0 bg-primary`}>
            {getNotificationIcon(notification.type)}
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <h3 className="font-semibold text-sm  truncate">
                  {notification.title}
                </h3>
                {!isRead && (
                  <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                )}
              </div>

              {/* Type Badge */}
              <Badge variant="secondary" className="text-xs flex-shrink-0">
                {getTypeLabel(notification.type)}
              </Badge>
            </div>

            {/* Sender Info */}
            {notification.sender_name && (
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs ">{notification.sender_name}</span>
              </div>
            )}

            {/* Body Text */}
            {notification.body && (
              <p className="text-sm  bg-primary/10 rounded p-2 leading-relaxed mb-3 line-clamp-2">
                {notification.body}
              </p>
            )}

            {/* Footer with timestamp and actions */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs ">
                <Clock className="h-3 w-3" />
                <span>{formatTimeAgo(notification.updated_at)}</span>
              </div>

              <div className="flex items-center gap-2">
                {notification.link && (
                  <Button
                    size="sm"
                    variant="link"
                    className="h-6 px-2 text-xs"
                    asChild
                  >
                    <Link href={notification.link}>
                      <ExternalLink className="h-3 w-3 mr-1" />
                      View
                    </Link>
                  </Button>
                )}

                {!isRead && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMarkAsRead();
                    }}
                    className="h-6 px-2 text-xs"
                  >
                    <Check className="h-3 w-3 mr-1" />
                    Mark Read
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Example usage with multiple notifications
const NotificationsList = () => {
  const [filter, setFilter] = useState<boolean | null>(null);
  const { data: notifications, isPending } = useSafeQuery(
    c_GetNotificationsByUser
  );

  const filteredNotifications =
    (filter === null
      ? notifications
      : filter === false
        ? notifications?.filter((n) => !n.is_read)
        : notifications?.filter((n) => n.is_read)) || [];

  const unreadCount = notifications?.filter((n) => !n.is_read).length || 0;

  return (
    <div className="max-w-5xl mx-auto p-4">
      <div className="mb-6">
        <h4 className=" mb-2">Notifications</h4>
        <p className="">Stay updated with your families</p>
      </div>

      {/* Filter Buttons */}
      <div className="mb-6">
        <div className="flex gap-2">
          <Button
            onClick={() => setFilter(null)}
            variant={filter === null ? "default" : "outline"}
            size="sm"
          >
            All
            <Badge variant="secondary" className="ml-2 text-xs">
              {notifications?.length || 0}
            </Badge>
          </Button>
          <Button
            onClick={() => setFilter(false)}
            variant={filter === false ? "default" : "outline"}
            size="sm"
          >
            Unread
            <Badge variant="secondary" className="ml-2 text-xs">
              {unreadCount}
            </Badge>
          </Button>
          <Button
            onClick={() => setFilter(true)}
            variant={filter === true ? "default" : "outline"}
            size="sm"
          >
            Read
            <Badge variant="secondary" className="ml-2 text-xs">
              {(notifications?.length || 0) - unreadCount}
            </Badge>
          </Button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.map((notification, index) => (
          <NotificationCard key={index} notification={notification} />
        ))}
      </div>

      {/* Empty State */}
      {filteredNotifications.length === 0 && (
        <div className="text-center py-12">
          <Bell className="h-12 w-12  mx-auto mb-4" />
          <h5 className=" mb-2">
            No {filter === null ? "" : filter} notifications
          </h5>
          <p className="">
            {filter === null
              ? "You're all caught up!"
              : `No ${filter} notifications found`}
          </p>
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

export default NotificationsList;
