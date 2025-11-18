import {
  Eye,
  EyeClosed,
  Heart,
  HeartCrack,
  Mars,
  Venus,
  VenusAndMars,
} from "lucide-react";
import React from "react";

export function LifeStatus({ isDeceased }: { isDeceased?: boolean }) {
  return (
    <div className="flex items-center gap-1 font-sora">
      {isDeceased ? (
        <HeartCrack className="size-3.5 text-muted-foreground" />
      ) : (
        <Heart className="size-3.5 text-muted-foreground" />
      )}
      <span>{isDeceased ? "Deceased" : "Living"}</span>
    </div>
  );
}
export function Gender({ sex }: { sex?: string }) {
  return (
    <div className="flex items-center gap-1 font-sora">
      {sex === "male" ? (
        <Mars className="size-3.5 text-muted-foreground" />
      ) : sex === "female" ? (
        <Venus className="size-3.5 text-muted-foreground" />
      ) : (
        <VenusAndMars className="size-3.5 text-muted-foreground" />
      )}
      <span className="capitalize">{sex}</span>
    </div>
  );
}
export function Visibility({ isPublic }: { isPublic?: boolean }) {
  return (
    <div className="flex items-center gap-1 font-sora">
      {isPublic ? (
        <Eye className="size-3.5 text-muted-foreground" />
      ) : (
        <EyeClosed className="size-3.5 text-muted-foreground" />
      )}
      <span>{isPublic ? "Public" : "Private"}</span>
    </div>
  );
}
