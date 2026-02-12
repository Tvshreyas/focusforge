import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    // Identity
    clerkId: v.string(),
    email: v.string(),
    
    // Subscription
    tier: v.union(v.literal("free"), v.literal("pro")),
    stripeCustomerId: v.optional(v.string()),
    stripeSubscriptionId: v.optional(v.string()),
    subscriptionStatus: v.optional(v.string()),
    gracePeriodEnd: v.optional(v.number()),
    
    // Progress
    level: v.number(),
    totalCompletedSessions: v.number(),
    
    // Streaks
    currentStreak: v.number(),
    longestStreak: v.number(),
    lastCompletionDate: v.optional(v.string()),
    streakFreezes: v.number(),
    
    // Timezone
    timezone: v.string(),
    timezoneOffset: v.number(),
    
    // Privacy
    analyticsOptIn: v.boolean(),
    
    // Timestamps
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_clerk_id", ["clerkId"])
    .index("by_email", ["email"])
    .index("by_tier", ["tier"])
    .index("by_stripe_customer", ["stripeCustomerId"])
    .index("by_stripe_subscription", ["stripeSubscriptionId"]),

  sessions: defineTable({
    userId: v.id("users"),
    
    // Session details
    task: v.string(),
    duration: v.number(),
    
    // Timestamps
    startTime: v.number(),
    endTime: v.number(),
    
    // Status
    completed: v.boolean(),
    abandoned: v.boolean(),
    
    // Idempotency
    idempotencyKey: v.string(),
    
    // Device tracking
    deviceId: v.optional(v.string()),
    
    // Timestamps
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_idempotency_key", ["idempotencyKey"])
    .index("by_user_and_completion", ["userId", "completed"])
    .index("by_user_and_date", ["userId", "startTime"]),

  webhookEvents: defineTable({
    eventId: v.string(),
    eventType: v.string(),
    subscriptionId: v.optional(v.string()),
    processed: v.boolean(),
    processedAt: v.optional(v.number()),
    createdAt: v.number(),
  })
    .index("by_event_id", ["eventId"])
    .index("by_subscription_id", ["subscriptionId"]),

  deletedUsers: defineTable({
    emailHash: v.string(),
    deletedAt: v.number(),
  })
    .index("by_email_hash", ["emailHash"]),
});
