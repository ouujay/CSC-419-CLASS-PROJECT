import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  messages: defineTable({
    body: v.string(),
    user: v.id("users"),
  }),

  users: defineTable({
    name: v.string(),
    tokenIdentifier: v.string(),
  }).index("by_token", ["tokenIdentifier"]),

  family_members: defineTable({
    first_name: v.string(),
    middle_name: v.string(),
    last_name: v.string(),
    date_of_birth: v.number(),        
    phone_number: v.string(),
    email: v.string(),
    gender: v.union(
      v.literal("male"),
      v.literal("female"),
      v.literal("unknown"),
      v.literal("prefer not to say")
    ),
    is_alive: v.boolean(),
    occupation: v.string(),
    location: v.object({
      latt: v.number(),
      long: v.number(),
    }),
  }),

  families: defineTable({
    family_name: v.string(),
    root_family_member: v.id("family_members"),
    owner_id: v.id("users"), 
  }).index("by_ownerId", ["owner_id"]),

  relationships: defineTable({
    family_id: v.id("families"),
    from_family_member: v.id("family_members"),
    to_family_member: v.id("family_members"),
    relationship_type: v.union(
      v.literal("parent"),
      v.literal("partner")
    ),
    position: v.number(), 
  }),
});
