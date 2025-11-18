/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as authorization_canAccess from "../authorization/canAccess.js";
import type * as authorization_policies from "../authorization/policies.js";
import type * as authorization_types from "../authorization/types.js";
import type * as collaborators_helpers from "../collaborators/helpers.js";
import type * as collaborators_mutations from "../collaborators/mutations.js";
import type * as collaborators_queries from "../collaborators/queries.js";
import type * as constants from "../constants.js";
import type * as crons from "../crons.js";
import type * as emails_actions from "../emails/actions.js";
import type * as emails_helpers from "../emails/helpers.js";
import type * as emails_mutations from "../emails/mutations.js";
import type * as emails_templates_CollaborationInvitation from "../emails/templates/CollaborationInvitation.js";
import type * as emails_templates_ConnectionRequest from "../emails/templates/ConnectionRequest.js";
import type * as emails_templates_ExtenstionRequest from "../emails/templates/ExtenstionRequest.js";
import type * as emails_templates_Notification from "../emails/templates/Notification.js";
import type * as emails_templates_Waitlist from "../emails/templates/Waitlist.js";
import type * as emails_templates_bulk_AlphaInvitation from "../emails/templates/bulk/AlphaInvitation.js";
import type * as emails_templates_bulk_BookACall from "../emails/templates/bulk/BookACall.js";
import type * as emails_templates_bulk_InviteSomeone from "../emails/templates/bulk/InviteSomeone.js";
import type * as emails_templates_bulk_NotYetUsers from "../emails/templates/bulk/NotYetUsers.js";
import type * as families_helpers from "../families/helpers.js";
import type * as families_mutations from "../families/mutations.js";
import type * as families_queries from "../families/queries.js";
import type * as familyContributions_helpers from "../familyContributions/helpers.js";
import type * as familyContributions_internals from "../familyContributions/internals.js";
import type * as familyContributions_mutations from "../familyContributions/mutations.js";
import type * as familyContributions_queries from "../familyContributions/queries.js";
import type * as familyMemberMatches_helpers from "../familyMemberMatches/helpers.js";
import type * as familyMemberMatches_internals from "../familyMemberMatches/internals.js";
import type * as familyMemberMatches_mutations from "../familyMemberMatches/mutations.js";
import type * as familyMemberMatches_queries from "../familyMemberMatches/queries.js";
import type * as familyMembers_helpers from "../familyMembers/helpers.js";
import type * as familyMembers_mutations from "../familyMembers/mutations.js";
import type * as familyMembers_queries from "../familyMembers/queries.js";
import type * as familyMemberships_helpers from "../familyMemberships/helpers.js";
import type * as familyRelationships_helpers from "../familyRelationships/helpers.js";
import type * as familyRequests_helpers from "../familyRequests/helpers.js";
import type * as familyRequests_mutations from "../familyRequests/mutations.js";
import type * as familyRequests_queries from "../familyRequests/queries.js";
import type * as feedback_mutations from "../feedback/mutations.js";
import type * as files_uploadFiles from "../files/uploadFiles.js";
import type * as http from "../http.js";
import type * as migrations from "../migrations.js";
import type * as notifications_helpers from "../notifications/helpers.js";
import type * as notifications_mutations from "../notifications/mutations.js";
import type * as notifications_queries from "../notifications/queries.js";
import type * as profiles_helpers from "../profiles/helpers.js";
import type * as profiles_mutations from "../profiles/mutations.js";
import type * as profiles_queries from "../profiles/queries.js";
import type * as rateLimiter from "../rateLimiter.js";
import type * as relationships_helpers from "../relationships/helpers.js";
import type * as relationships_mutations from "../relationships/mutations.js";
import type * as relationships_queries from "../relationships/queries.js";
import type * as subscriptions_helpers from "../subscriptions/helpers.js";
import type * as subscriptions_mutations from "../subscriptions/mutations.js";
import type * as subscriptions_queries from "../subscriptions/queries.js";
import type * as tables from "../tables.js";
import type * as users_mutations from "../users/mutations.js";
import type * as users_queries from "../users/queries.js";
import type * as utils_generate from "../utils/generate.js";
import type * as utils_helps from "../utils/helps.js";
import type * as utils_resend from "../utils/resend.js";
import type * as utils_wrappers_log from "../utils/wrappers/log.js";
import type * as utils_wrappers_user from "../utils/wrappers/user.js";
import type * as waitlist_actions from "../waitlist/actions.js";
import type * as waitlist_mutations from "../waitlist/mutations.js";
import type * as waitlist_queries from "../waitlist/queries.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  "authorization/canAccess": typeof authorization_canAccess;
  "authorization/policies": typeof authorization_policies;
  "authorization/types": typeof authorization_types;
  "collaborators/helpers": typeof collaborators_helpers;
  "collaborators/mutations": typeof collaborators_mutations;
  "collaborators/queries": typeof collaborators_queries;
  constants: typeof constants;
  crons: typeof crons;
  "emails/actions": typeof emails_actions;
  "emails/helpers": typeof emails_helpers;
  "emails/mutations": typeof emails_mutations;
  "emails/templates/CollaborationInvitation": typeof emails_templates_CollaborationInvitation;
  "emails/templates/ConnectionRequest": typeof emails_templates_ConnectionRequest;
  "emails/templates/ExtenstionRequest": typeof emails_templates_ExtenstionRequest;
  "emails/templates/Notification": typeof emails_templates_Notification;
  "emails/templates/Waitlist": typeof emails_templates_Waitlist;
  "emails/templates/bulk/AlphaInvitation": typeof emails_templates_bulk_AlphaInvitation;
  "emails/templates/bulk/BookACall": typeof emails_templates_bulk_BookACall;
  "emails/templates/bulk/InviteSomeone": typeof emails_templates_bulk_InviteSomeone;
  "emails/templates/bulk/NotYetUsers": typeof emails_templates_bulk_NotYetUsers;
  "families/helpers": typeof families_helpers;
  "families/mutations": typeof families_mutations;
  "families/queries": typeof families_queries;
  "familyContributions/helpers": typeof familyContributions_helpers;
  "familyContributions/internals": typeof familyContributions_internals;
  "familyContributions/mutations": typeof familyContributions_mutations;
  "familyContributions/queries": typeof familyContributions_queries;
  "familyMemberMatches/helpers": typeof familyMemberMatches_helpers;
  "familyMemberMatches/internals": typeof familyMemberMatches_internals;
  "familyMemberMatches/mutations": typeof familyMemberMatches_mutations;
  "familyMemberMatches/queries": typeof familyMemberMatches_queries;
  "familyMembers/helpers": typeof familyMembers_helpers;
  "familyMembers/mutations": typeof familyMembers_mutations;
  "familyMembers/queries": typeof familyMembers_queries;
  "familyMemberships/helpers": typeof familyMemberships_helpers;
  "familyRelationships/helpers": typeof familyRelationships_helpers;
  "familyRequests/helpers": typeof familyRequests_helpers;
  "familyRequests/mutations": typeof familyRequests_mutations;
  "familyRequests/queries": typeof familyRequests_queries;
  "feedback/mutations": typeof feedback_mutations;
  "files/uploadFiles": typeof files_uploadFiles;
  http: typeof http;
  migrations: typeof migrations;
  "notifications/helpers": typeof notifications_helpers;
  "notifications/mutations": typeof notifications_mutations;
  "notifications/queries": typeof notifications_queries;
  "profiles/helpers": typeof profiles_helpers;
  "profiles/mutations": typeof profiles_mutations;
  "profiles/queries": typeof profiles_queries;
  rateLimiter: typeof rateLimiter;
  "relationships/helpers": typeof relationships_helpers;
  "relationships/mutations": typeof relationships_mutations;
  "relationships/queries": typeof relationships_queries;
  "subscriptions/helpers": typeof subscriptions_helpers;
  "subscriptions/mutations": typeof subscriptions_mutations;
  "subscriptions/queries": typeof subscriptions_queries;
  tables: typeof tables;
  "users/mutations": typeof users_mutations;
  "users/queries": typeof users_queries;
  "utils/generate": typeof utils_generate;
  "utils/helps": typeof utils_helps;
  "utils/resend": typeof utils_resend;
  "utils/wrappers/log": typeof utils_wrappers_log;
  "utils/wrappers/user": typeof utils_wrappers_user;
  "waitlist/actions": typeof waitlist_actions;
  "waitlist/mutations": typeof waitlist_mutations;
  "waitlist/queries": typeof waitlist_queries;
}>;
declare const fullApiWithMounts: typeof fullApi;

export declare const api: FilterApi<
  typeof fullApiWithMounts,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApiWithMounts,
  FunctionReference<any, "internal">
>;

export declare const components: {
  r2: {
    lib: {
      deleteMetadata: FunctionReference<
        "mutation",
        "internal",
        { bucket: string; key: string },
        null
      >;
      deleteObject: FunctionReference<
        "mutation",
        "internal",
        {
          accessKeyId: string;
          bucket: string;
          endpoint: string;
          key: string;
          secretAccessKey: string;
        },
        null
      >;
      deleteR2Object: FunctionReference<
        "action",
        "internal",
        {
          accessKeyId: string;
          bucket: string;
          endpoint: string;
          key: string;
          secretAccessKey: string;
        },
        null
      >;
      getMetadata: FunctionReference<
        "query",
        "internal",
        {
          accessKeyId: string;
          bucket: string;
          endpoint: string;
          key: string;
          secretAccessKey: string;
        },
        {
          bucket: string;
          bucketLink: string;
          contentType?: string;
          key: string;
          lastModified: string;
          link: string;
          sha256?: string;
          size?: number;
          url: string;
        } | null
      >;
      listMetadata: FunctionReference<
        "query",
        "internal",
        {
          accessKeyId: string;
          bucket: string;
          cursor?: string;
          endpoint: string;
          limit?: number;
          secretAccessKey: string;
        },
        {
          continueCursor: string;
          isDone: boolean;
          page: Array<{
            bucket: string;
            bucketLink: string;
            contentType?: string;
            key: string;
            lastModified: string;
            link: string;
            sha256?: string;
            size?: number;
            url: string;
          }>;
          pageStatus?: null | "SplitRecommended" | "SplitRequired";
          splitCursor?: null | string;
        }
      >;
      store: FunctionReference<
        "action",
        "internal",
        {
          accessKeyId: string;
          bucket: string;
          endpoint: string;
          secretAccessKey: string;
          url: string;
        },
        any
      >;
      syncMetadata: FunctionReference<
        "action",
        "internal",
        {
          accessKeyId: string;
          bucket: string;
          endpoint: string;
          key: string;
          onComplete?: string;
          secretAccessKey: string;
        },
        null
      >;
      upsertMetadata: FunctionReference<
        "mutation",
        "internal",
        {
          bucket: string;
          contentType?: string;
          key: string;
          lastModified: string;
          link: string;
          sha256?: string;
          size?: number;
        },
        { isNew: boolean }
      >;
    };
  };
  migrations: {
    lib: {
      cancel: FunctionReference<
        "mutation",
        "internal",
        { name: string },
        {
          batchSize?: number;
          cursor?: string | null;
          error?: string;
          isDone: boolean;
          latestEnd?: number;
          latestStart: number;
          name: string;
          next?: Array<string>;
          processed: number;
          state: "inProgress" | "success" | "failed" | "canceled" | "unknown";
        }
      >;
      cancelAll: FunctionReference<
        "mutation",
        "internal",
        { sinceTs?: number },
        Array<{
          batchSize?: number;
          cursor?: string | null;
          error?: string;
          isDone: boolean;
          latestEnd?: number;
          latestStart: number;
          name: string;
          next?: Array<string>;
          processed: number;
          state: "inProgress" | "success" | "failed" | "canceled" | "unknown";
        }>
      >;
      clearAll: FunctionReference<
        "mutation",
        "internal",
        { before?: number },
        null
      >;
      getStatus: FunctionReference<
        "query",
        "internal",
        { limit?: number; names?: Array<string> },
        Array<{
          batchSize?: number;
          cursor?: string | null;
          error?: string;
          isDone: boolean;
          latestEnd?: number;
          latestStart: number;
          name: string;
          next?: Array<string>;
          processed: number;
          state: "inProgress" | "success" | "failed" | "canceled" | "unknown";
        }>
      >;
      migrate: FunctionReference<
        "mutation",
        "internal",
        {
          batchSize?: number;
          cursor?: string | null;
          dryRun: boolean;
          fnHandle: string;
          name: string;
          next?: Array<{ fnHandle: string; name: string }>;
        },
        {
          batchSize?: number;
          cursor?: string | null;
          error?: string;
          isDone: boolean;
          latestEnd?: number;
          latestStart: number;
          name: string;
          next?: Array<string>;
          processed: number;
          state: "inProgress" | "success" | "failed" | "canceled" | "unknown";
        }
      >;
    };
  };
  resend: {
    lib: {
      cancelEmail: FunctionReference<
        "mutation",
        "internal",
        { emailId: string },
        null
      >;
      cleanupAbandonedEmails: FunctionReference<
        "mutation",
        "internal",
        { olderThan?: number },
        null
      >;
      cleanupOldEmails: FunctionReference<
        "mutation",
        "internal",
        { olderThan?: number },
        null
      >;
      get: FunctionReference<
        "query",
        "internal",
        { emailId: string },
        {
          complained: boolean;
          createdAt: number;
          errorMessage?: string;
          finalizedAt: number;
          from: string;
          headers?: Array<{ name: string; value: string }>;
          html?: string;
          opened: boolean;
          replyTo: Array<string>;
          resendId?: string;
          segment: number;
          status:
            | "waiting"
            | "queued"
            | "cancelled"
            | "sent"
            | "delivered"
            | "delivery_delayed"
            | "bounced"
            | "failed";
          subject: string;
          text?: string;
          to: string;
        } | null
      >;
      getStatus: FunctionReference<
        "query",
        "internal",
        { emailId: string },
        {
          complained: boolean;
          errorMessage: string | null;
          opened: boolean;
          status:
            | "waiting"
            | "queued"
            | "cancelled"
            | "sent"
            | "delivered"
            | "delivery_delayed"
            | "bounced"
            | "failed";
        } | null
      >;
      handleEmailEvent: FunctionReference<
        "mutation",
        "internal",
        { event: any },
        null
      >;
      sendEmail: FunctionReference<
        "mutation",
        "internal",
        {
          from: string;
          headers?: Array<{ name: string; value: string }>;
          html?: string;
          options: {
            apiKey: string;
            initialBackoffMs: number;
            onEmailEvent?: { fnHandle: string };
            retryAttempts: number;
            testMode: boolean;
          };
          replyTo?: Array<string>;
          subject: string;
          text?: string;
          to: string;
        },
        string
      >;
    };
  };
  rateLimiter: {
    lib: {
      checkRateLimit: FunctionReference<
        "query",
        "internal",
        {
          config:
            | {
                capacity?: number;
                kind: "token bucket";
                maxReserved?: number;
                period: number;
                rate: number;
                shards?: number;
                start?: null;
              }
            | {
                capacity?: number;
                kind: "fixed window";
                maxReserved?: number;
                period: number;
                rate: number;
                shards?: number;
                start?: number;
              };
          count?: number;
          key?: string;
          name: string;
          reserve?: boolean;
          throws?: boolean;
        },
        { ok: true; retryAfter?: number } | { ok: false; retryAfter: number }
      >;
      clearAll: FunctionReference<
        "mutation",
        "internal",
        { before?: number },
        null
      >;
      getServerTime: FunctionReference<"mutation", "internal", {}, number>;
      getValue: FunctionReference<
        "query",
        "internal",
        {
          config:
            | {
                capacity?: number;
                kind: "token bucket";
                maxReserved?: number;
                period: number;
                rate: number;
                shards?: number;
                start?: null;
              }
            | {
                capacity?: number;
                kind: "fixed window";
                maxReserved?: number;
                period: number;
                rate: number;
                shards?: number;
                start?: number;
              };
          key?: string;
          name: string;
          sampleShards?: number;
        },
        {
          config:
            | {
                capacity?: number;
                kind: "token bucket";
                maxReserved?: number;
                period: number;
                rate: number;
                shards?: number;
                start?: null;
              }
            | {
                capacity?: number;
                kind: "fixed window";
                maxReserved?: number;
                period: number;
                rate: number;
                shards?: number;
                start?: number;
              };
          shard: number;
          ts: number;
          value: number;
        }
      >;
      rateLimit: FunctionReference<
        "mutation",
        "internal",
        {
          config:
            | {
                capacity?: number;
                kind: "token bucket";
                maxReserved?: number;
                period: number;
                rate: number;
                shards?: number;
                start?: null;
              }
            | {
                capacity?: number;
                kind: "fixed window";
                maxReserved?: number;
                period: number;
                rate: number;
                shards?: number;
                start?: number;
              };
          count?: number;
          key?: string;
          name: string;
          reserve?: boolean;
          throws?: boolean;
        },
        { ok: true; retryAfter?: number } | { ok: false; retryAfter: number }
      >;
      resetRateLimit: FunctionReference<
        "mutation",
        "internal",
        { key?: string; name: string },
        null
      >;
    };
    time: {
      getServerTime: FunctionReference<"mutation", "internal", {}, number>;
    };
  };
};
