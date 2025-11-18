import { ExtendedRelationshipsSchema } from "@/convex/tables";
import * as p5Types from "p5";
import { z } from "zod";
import { Doc } from "@/convex/_generated/dataModel";

export type ExtendedRelationshipsType = z.infer<
  typeof ExtendedRelationshipsSchema
>;

export type ParentageType = Doc<"relationships">["parentage_type"];
export type PartnershipType = Doc<"relationships">["partnership_type"];

export type P5jsContainerRef = HTMLDivElement;

export type P5jsSketch<T> = (
  p5: p5Types,
  parentRef: P5jsContainerRef,
  data: T
) => void;


export interface DataProviderContextValue<T> {
  data: T;
  isPending: boolean;
  isError: boolean;
  isSuccess: boolean;
}
