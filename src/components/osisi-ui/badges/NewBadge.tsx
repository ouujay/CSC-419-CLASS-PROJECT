import { Badge } from "@/components/ui/badge";
import React from "react";

type NewBadgeProps = {
  timestamp: number; // UNIX epoch in milliseconds
  className?: string;
};

export const NewBadge: React.FC<NewBadgeProps> = ({
  timestamp,
  className = "",
}) => {
  const isNew = Date.now() - timestamp < 0.5 * 60 * 60 * 1000;

  if (!isNew) return null;

  return <Badge className={className} variant={"outline"}>new</Badge>;
};
