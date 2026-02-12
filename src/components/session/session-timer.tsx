"use client";

import { useEffect, useState } from "react";
import { Timer, Pause, Play, X } from "lucide-react";

interface SessionTimerProps {
    endTime: number;
    task: string;
    onComplete?: () => void;
    onAbandon?: () => void;
}

export function SessionTimer({
    endTime,
    task,
    onComplete,
    onAbandon,
}: SessionTimerProps) {
    const [timeLeft, setTimeLeft] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        const calculateTimeLeft = () => {
            const now = Date.now();
            const remaining = Math.max(0, endTime - now);
            return Math.floor(remaining / 1000);
        };

        setTimeLeft(calculateTimeLeft());

        const interval = setInterval(() => {
            if (!isPaused) {
                const remaining = calculateTimeLeft();
                setTimeLeft(remaining);

                if (remaining <= 0) {
                    clearInterval(interval);
                    onComplete?.();
                }
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [endTime, isPaused, onComplete]);

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    const progress = (() => {
        // Calculate progress based on time remaining
        const now = Date.now();
        const remainingMs = Math.max(0, endTime - now);
        // Estimate total duration from remaining time (simplified)
        const totalMs = timeLeft > 0 ? remainingMs + 1000 : 1;
        const elapsedMs = Math.max(0, totalMs - remainingMs);
        return Math.min(100, (elapsedMs / totalMs) * 100);
    })();

    return (
        <div className="rounded-xl border bg-gradient-to-br from-purple-500/10 to-pink-500/10 p-6 shadow-lg">
            {/* Task Display */}
            <div className="mb-4 text-center">
                <p className="text-sm text-muted-foreground">Currently focusing on</p>
                <h3 className="text-lg font-semibold">{task}</h3>
            </div>

            {/* Timer Display */}
            <div className="mb-6 flex items-center justify-center">
                <div className="relative flex h-48 w-48 items-center justify-center rounded-full border-4 border-purple-500/20 bg-background">
                    {/* Progress ring */}
                    <svg className="absolute inset-0 h-full w-full -rotate-90">
                        <circle
                            cx="96"
                            cy="96"
                            r="90"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="8"
                            className="text-purple-500/20"
                        />
                        <circle
                            cx="96"
                            cy="96"
                            r="90"
                            fill="none"
                            stroke="url(#gradient)"
                            strokeWidth="8"
                            strokeLinecap="round"
                            strokeDasharray={565.48}
                            strokeDashoffset={565.48 * (1 - progress / 100)}
                            className="transition-all duration-1000"
                        />
                        <defs>
                            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#a855f7" />
                                <stop offset="100%" stopColor="#ec4899" />
                            </linearGradient>
                        </defs>
                    </svg>

                    {/* Time Display */}
                    <div className="flex flex-col items-center">
                        <Timer className="mb-2 h-6 w-6 text-purple-500" />
                        <span className="text-4xl font-bold tabular-nums">
                            {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
                        </span>
                        <span className="text-xs text-muted-foreground">remaining</span>
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-4">
                <button
                    onClick={() => setIsPaused(!isPaused)}
                    className="flex h-12 w-12 items-center justify-center rounded-full border bg-background transition-colors hover:bg-muted"
                    title={isPaused ? "Resume" : "Pause display"}
                >
                    {isPaused ? (
                        <Play className="h-5 w-5" />
                    ) : (
                        <Pause className="h-5 w-5" />
                    )}
                </button>
                <button
                    onClick={onAbandon}
                    className="flex h-12 w-12 items-center justify-center rounded-full border border-red-500/20 bg-red-500/10 text-red-500 transition-colors hover:bg-red-500/20"
                    title="Abandon session"
                >
                    <X className="h-5 w-5" />
                </button>
            </div>

            {/* Encouragement */}
            <p className="mt-4 text-center text-sm text-muted-foreground">
                {timeLeft > 60
                    ? "Stay focused! You&apos;re doing great."
                    : "Almost there! Final stretch."}
            </p>
        </div>
    );
}
