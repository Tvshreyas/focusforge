"use client";

import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { SessionTimer } from "./session-timer";
import { Id } from "../../../convex/_generated/dataModel";

interface ActiveSessionProps {
    session: {
        _id: Id<"sessions">;
        task: string;
        endTime: number;
        duration: number;
    };
    onSessionEnd?: () => void;
}

export function ActiveSession({ session, onSessionEnd }: ActiveSessionProps) {
    const abandonSession = useMutation(api.sessions.abandonSession);

    const handleAbandon = async () => {
        if (confirm("Are you sure you want to abandon this session? Progress won't be saved.")) {
            await abandonSession({ sessionId: session._id });
            onSessionEnd?.();
        }
    };

    const handleComplete = () => {
        // Session completed naturally - in Phase 3 we'll call completeSession mutation
        onSessionEnd?.();
    };

    return (
        <div className="rounded-xl border bg-card p-6 shadow-sm">
            <SessionTimer
                endTime={session.endTime}
                task={session.task}
                onComplete={handleComplete}
                onAbandon={handleAbandon}
            />
        </div>
    );
}
