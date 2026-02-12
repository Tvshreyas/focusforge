import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

/**
 * Get the current user from the database.
 * Returns null if user doesn't exist yet.
 */
export const getCurrentUser = query({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            return null;
        }

        const user = await ctx.db
            .query("users")
            .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
            .first();

        return user;
    },
});

/**
 * Get or create a user record.
 * Called when a user first accesses the app after Clerk authentication.
 * This is the "lazy sync" approach - no webhook needed for MVP.
 */
export const getOrCreateUser = mutation({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Unauthorized: No valid identity");
        }

        // Check if user already exists
        const existingUser = await ctx.db
            .query("users")
            .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
            .first();

        if (existingUser) {
            return existingUser;
        }

        // Create new user with default values
        const now = Date.now();
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
        const timezoneOffset = new Date().getTimezoneOffset();

        const userId = await ctx.db.insert("users", {
            clerkId: identity.subject,
            email: identity.email || "",

            // Subscription defaults
            tier: "free",
            stripeCustomerId: undefined,
            stripeSubscriptionId: undefined,
            subscriptionStatus: undefined,
            gracePeriodEnd: undefined,

            // Progress defaults
            level: 1,
            totalCompletedSessions: 0,

            // Streak defaults
            currentStreak: 0,
            longestStreak: 0,
            lastCompletionDate: undefined,
            streakFreezes: 0,

            // Timezone
            timezone,
            timezoneOffset,

            // Privacy - default to opted in (can change later)
            analyticsOptIn: true,

            // Timestamps
            createdAt: now,
            updatedAt: now,
        });

        return await ctx.db.get(userId);
    },
});

/**
 * Update user preferences (e.g., analytics opt-in, timezone).
 */
export const updateUserPreferences = mutation({
    args: {
        analyticsOptIn: v.optional(v.boolean()),
        timezone: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Unauthorized");
        }

        const user = await ctx.db
            .query("users")
            .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
            .first();

        if (!user) {
            throw new Error("User not found");
        }

        const updates: Record<string, unknown> = {
            updatedAt: Date.now(),
        };

        if (args.analyticsOptIn !== undefined) {
            updates.analyticsOptIn = args.analyticsOptIn;
        }

        if (args.timezone !== undefined) {
            updates.timezone = args.timezone;
            updates.timezoneOffset = new Date().getTimezoneOffset();
        }

        await ctx.db.patch(user._id, updates);

        return await ctx.db.get(user._id);
    },
});
