"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Loader2 } from "lucide-react";

interface SessionFormProps {
    onSessionCreated?: () => void;
}

export function SessionForm({ onSessionCreated }: SessionFormProps) {
    const [task, setTask] = useState("");
    const [duration, setDuration] = useState(5);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const createSession = useMutation(api.sessions.createSession);
    const durations = useQuery(api.sessions.getUnlockedDurations);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);

        try {
            // Generate idempotency key to prevent duplicate submissions
            const idempotencyKey = `${Date.now()}-${Math.random().toString(36).slice(2)}`;

            await createSession({
                task,
                duration,
                idempotencyKey,
                deviceId: typeof window !== "undefined" ? window.navigator.userAgent.slice(0, 50) : undefined,
            });

            setTask("");
            onSessionCreated?.();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to create session");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
                <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-600 dark:text-red-400">
                    {error}
                </div>
            )}

            <div>
                <label htmlFor="task" className="mb-2 block text-sm font-medium">
                    What will you focus on?
                </label>
                <input
                    id="task"
                    type="text"
                    value={task}
                    onChange={(e) => setTask(e.target.value)}
                    placeholder="e.g., Study for exam, Write report"
                    className="w-full rounded-lg border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    maxLength={200}
                    required
                    disabled={isSubmitting}
                />
            </div>

            <div>
                <label htmlFor="duration" className="mb-2 block text-sm font-medium">
                    Duration
                </label>
                <select
                    id="duration"
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="w-full rounded-lg border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    disabled={isSubmitting}
                >
                    {durations?.map((d) => (
                        <option key={d.value} value={d.value} disabled={d.locked}>
                            {d.label} {d.locked ? `🔒 (Level ${d.level})` : ""}
                        </option>
                    )) || <option value={5}>5 minutes (Level 1)</option>}
                </select>
                <p className="mt-1 text-xs text-muted-foreground">
                    Complete sessions to unlock longer durations
                </p>
            </div>

            <button
                type="submit"
                disabled={isSubmitting || !task.trim()}
                className="w-full rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 py-3 font-medium text-white shadow-lg transition-all hover:opacity-90 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Starting...
                    </span>
                ) : (
                    "Start Focus Session"
                )}
            </button>
        </form>
    );
}
