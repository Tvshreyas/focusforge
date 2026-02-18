"use client";

import { useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { Doc } from "../../../convex/_generated/dataModel";
import { Timer, TrendingUp, Flame, Zap, Loader2 } from "lucide-react";
import { SessionForm } from "@/components/session/session-form";
import { ActiveSession } from "@/components/session/active-session";

export function DashboardClient() {
    // Get or create user on first load
    const createUser = useMutation(api.users.getOrCreateUser);
    const user = useQuery(api.users.getCurrentUser);
    const activeSession = useQuery(api.sessions.getActiveSession);
    const recentSessions = useQuery(api.sessions.getSessions, { limit: 5 });

    // Create user record if it doesn't exist
    useEffect(() => {
        if (user === null) {
            createUser().catch(console.error);
        }
    }, [user, createUser]);

    // Loading state
    if (user === undefined) {
        return (
            <div className="container flex min-h-[60vh] items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
            </div>
        );
    }

    const stats = [
        {
            label: "Current Level",
            value: user?.level || 1,
            icon: <TrendingUp className="h-5 w-5 text-purple-500" />,
            detail: `Max ${getMaxDuration(user?.level || 1)} min sessions`,
        },
        {
            label: "Current Streak",
            value: user?.currentStreak || 0,
            icon: <Flame className="h-5 w-5 text-orange-500" />,
            detail: user?.currentStreak ? `${user.currentStreak} day${user.currentStreak > 1 ? "s" : ""}` : "Start today!",
        },
        {
            label: "Total Sessions",
            value: user?.totalCompletedSessions || 0,
            icon: <Timer className="h-5 w-5 text-blue-500" />,
            detail: "completed",
        },
        {
            label: "Account",
            value: user?.tier === "pro" ? "Pro" : "Free",
            icon: <Zap className="h-5 w-5 text-yellow-500" />,
            detail: user?.tier === "pro" ? "Unlimited access" : "3 sessions/day",
        },
    ];

    return (
        <div className="container py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold">Dashboard</h1>
                <p className="text-muted-foreground">
                    Welcome back! Ready to focus?
                </p>
            </div>

            {/* Stats Grid */}
            <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                    <div
                        key={stat.label}
                        className="rounded-xl border bg-card p-4 shadow-sm"
                    >
                        <div className="flex items-center gap-2">
                            {stat.icon}
                            <span className="text-sm text-muted-foreground">{stat.label}</span>
                        </div>
                        <p className="mt-2 text-2xl font-bold">{stat.value}</p>
                        <p className="text-xs text-muted-foreground">{stat.detail}</p>
                    </div>
                ))}
            </div>

            {/* Main Content */}
            <div className="grid gap-8 lg:grid-cols-2">
                {/* Active Session or Start Form */}
                <div>
                    <h2 className="mb-4 text-xl font-semibold">
                        {activeSession ? "Active Session" : "Start a Session"}
                    </h2>
                    {activeSession ? (
                        <ActiveSession
                            session={activeSession}
                            onSessionEnd={() => {
                                // Will trigger re-query automatically
                            }}
                        />
                    ) : (
                        <div className="rounded-xl border bg-card p-6 shadow-sm">
                            <SessionForm
                                onSessionCreated={() => {
                                    // Will trigger re-query automatically
                                }}
                            />
                        </div>
                    )}
                </div>

                {/* Recent Sessions */}
                <div>
                    <h2 className="mb-4 text-xl font-semibold">Recent Sessions</h2>
                    <div className="rounded-xl border bg-card shadow-sm">
                        {!recentSessions || recentSessions.length === 0 ? (
                            <div className="p-6 text-center text-muted-foreground">
                                <Timer className="mx-auto mb-2 h-8 w-8 opacity-50" />
                                <p>No sessions yet</p>
                                <p className="text-sm">Complete your first focus session!</p>
                            </div>
                        ) : (
                            <ul className="divide-y">
                                {recentSessions.map((session: Doc<"sessions">) => (
                                    <li key={session._id} className="flex items-center gap-4 p-4">
                                        <div
                                            className={`flex h-10 w-10 items-center justify-center rounded-full ${session.completed
                                                    ? "bg-green-500/10 text-green-500"
                                                    : session.abandoned
                                                        ? "bg-red-500/10 text-red-500"
                                                        : "bg-yellow-500/10 text-yellow-500"
                                                }`}
                                        >
                                            <Timer className="h-5 w-5" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium">{session.task}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {session.duration} min · {formatDate(session.startTime)}
                                            </p>
                                        </div>
                                        <span
                                            className={`rounded-full px-2 py-1 text-xs font-medium ${session.completed
                                                    ? "bg-green-500/10 text-green-600"
                                                    : session.abandoned
                                                        ? "bg-red-500/10 text-red-600"
                                                        : "bg-yellow-500/10 text-yellow-600"
                                                }`}
                                        >
                                            {session.completed
                                                ? "Completed"
                                                : session.abandoned
                                                    ? "Abandoned"
                                                    : "In Progress"}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>

            {/* Medical Disclaimer (Required by PRD Section 8.5) */}
            <div className="mt-8 rounded-lg border bg-muted/50 p-4 text-xs text-muted-foreground">
                <strong>Disclaimer:</strong> FocusForge is a productivity tool, not a medical device.
                It is not intended to diagnose, treat, cure, or prevent any medical condition including ADHD.
                Consult a healthcare professional for medical advice.
            </div>
        </div>
    );
}

function getMaxDuration(level: number): number {
    const durations: Record<number, number> = {
        1: 5, 2: 10, 3: 15, 4: 20, 5: 25,
        6: 30, 7: 45, 8: 60, 9: 90, 10: 120,
    };
    return durations[level] || 5;
}

function formatDate(timestamp: number): string {
    const date = new Date(timestamp);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
        return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } else if (diffDays === 1) {
        return "Yesterday";
    } else if (diffDays < 7) {
        return date.toLocaleDateString([], { weekday: "short" });
    }
    return date.toLocaleDateString([], { month: "short", day: "numeric" });
}
