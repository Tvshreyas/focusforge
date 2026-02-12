import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Maximum duration by level (in minutes)
const MAX_DURATION_BY_LEVEL: Record<number, number> = {
    1: 5,
    2: 10,
    3: 15,
    4: 20,
    5: 25,
    6: 30,
    7: 45,
    8: 60,
    9: 90,
    10: 120,
};

/**
 * Get the current active session for the authenticated user.
 * Returns null if no active session exists.
 */
export const getActiveSession = query({
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

        if (!user) {
            return null;
        }

        const now = Date.now();

        // Find active session (not completed, not abandoned, and not expired)
        const activeSession = await ctx.db
            .query("sessions")
            .withIndex("by_user", (q) => q.eq("userId", user._id))
            .filter((q) =>
                q.and(
                    q.eq(q.field("completed"), false),
                    q.eq(q.field("abandoned"), false),
                    q.gt(q.field("endTime"), now)
                )
            )
            .first();

        return activeSession;
    },
});

/**
 * Get recent sessions for the authenticated user.
 */
export const getSessions = query({
    args: {
        limit: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            return [];
        }

        const user = await ctx.db
            .query("users")
            .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
            .first();

        if (!user) {
            return [];
        }

        const limit = args.limit || 10;

        const sessions = await ctx.db
            .query("sessions")
            .withIndex("by_user", (q) => q.eq("userId", user._id))
            .order("desc")
            .take(limit);

        return sessions;
    },
});

/**
 * Create a new focus session.
 * Basic version for Phase 2 - full security checks added in Phase 3.
 */
export const createSession = mutation({
    args: {
        task: v.string(),
        duration: v.number(),
        idempotencyKey: v.string(),
        deviceId: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Unauthorized");
        }

        // Get user
        const user = await ctx.db
            .query("users")
            .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
            .first();

        if (!user) {
            throw new Error("User not found. Please refresh and try again.");
        }

        // Check for duplicate request (idempotency)
        const existingSession = await ctx.db
            .query("sessions")
            .withIndex("by_idempotency_key", (q) =>
                q.eq("idempotencyKey", args.idempotencyKey)
            )
            .first();

        if (existingSession) {
            return { sessionId: existingSession._id, duplicate: true };
        }

        // Validate duration against user level
        const maxDuration = MAX_DURATION_BY_LEVEL[user.level] || 5;
        if (args.duration > maxDuration) {
            throw new Error(
                `Duration exceeds your current level. Max: ${maxDuration} minutes.`
            );
        }

        // Sanitize task (basic - full sanitization in Phase 3)
        const sanitizedTask = args.task.trim().slice(0, 200);

        if (sanitizedTask.length === 0) {
            throw new Error("Task description is required.");
        }

        // Calculate timestamps
        const now = Date.now();
        const durationMs = args.duration * 60 * 1000;

        // Create session
        const sessionId = await ctx.db.insert("sessions", {
            userId: user._id,
            task: sanitizedTask,
            duration: args.duration,
            startTime: now,
            endTime: now + durationMs,
            completed: false,
            abandoned: false,
            idempotencyKey: args.idempotencyKey,
            deviceId: args.deviceId,
            createdAt: now,
        });

        return { sessionId, duplicate: false };
    },
});

/**
 * Abandon an active session.
 */
export const abandonSession = mutation({
    args: {
        sessionId: v.id("sessions"),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Unauthorized");
        }

        const session = await ctx.db.get(args.sessionId);
        if (!session) {
            throw new Error("Session not found");
        }

        // Verify ownership
        const user = await ctx.db
            .query("users")
            .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
            .first();

        if (!user || session.userId !== user._id) {
            throw new Error("Not authorized to modify this session");
        }

        await ctx.db.patch(args.sessionId, {
            abandoned: true,
        });

        return { success: true };
    },
});

/**
 * Get unlocked durations for a user based on their level.
 */
export const getUnlockedDurations = query({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            return [{ value: 5, label: "5 minutes", locked: false }];
        }

        const user = await ctx.db
            .query("users")
            .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
            .first();

        const level = user?.level || 1;

        return Object.entries(MAX_DURATION_BY_LEVEL).map(([lvl, duration]) => ({
            value: duration,
            label: `${duration} minutes`,
            level: parseInt(lvl),
            locked: parseInt(lvl) > level,
        }));
    },
});
