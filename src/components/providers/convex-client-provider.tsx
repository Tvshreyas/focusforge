"use client";

import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ConvexReactClient } from "convex/react";
import { ReactNode } from "react";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
const clerkPublishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

// Create Convex client only if URL is available
const convex = convexUrl ? new ConvexReactClient(convexUrl) : null;

function ConvexWrapper({ children }: { children: ReactNode }) {
    // If no Convex client, just render children
    if (!convex) {
        return <>{children}</>;
    }

    return (
        <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
            {children}
        </ConvexProviderWithClerk>
    );
}

export function ConvexClientProvider({ children }: { children: ReactNode }) {
    // During build time without env vars, render children without providers
    if (!clerkPublishableKey) {
        return <>{children}</>;
    }

    return (
        <ClerkProvider publishableKey={clerkPublishableKey}>
            <ConvexWrapper>{children}</ConvexWrapper>
        </ClerkProvider>
    );
}
