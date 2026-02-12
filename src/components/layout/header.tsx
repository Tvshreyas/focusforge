"use client";

import { UserButton, SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import Link from "next/link";
import { Zap } from "lucide-react";

// Check if Clerk is configured
const isClerkConfigured = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

export function Header() {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 max-w-screen-2xl items-center">
                <Link href="/" className="mr-6 flex items-center space-x-2">
                    <Zap className="h-6 w-6 text-purple-500" />
                    <span className="font-bold text-xl bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                        FocusForge
                    </span>
                </Link>

                <nav className="flex flex-1 items-center space-x-6 text-sm font-medium">
                    {isClerkConfigured && (
                        <SignedIn>
                            <Link
                                href="/dashboard"
                                className="transition-colors hover:text-foreground/80 text-foreground/60"
                            >
                                Dashboard
                            </Link>
                            <Link
                                href="/dashboard/analytics"
                                className="transition-colors hover:text-foreground/80 text-foreground/60"
                            >
                                Analytics
                            </Link>
                        </SignedIn>
                    )}
                </nav>

                <div className="flex items-center space-x-4">
                    {isClerkConfigured ? (
                        <>
                            <SignedIn>
                                <UserButton
                                    afterSignOutUrl="/"
                                    appearance={{
                                        elements: {
                                            avatarBox: "h-8 w-8",
                                        },
                                    }}
                                />
                            </SignedIn>
                            <SignedOut>
                                <SignInButton mode="modal">
                                    <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2">
                                        Sign In
                                    </button>
                                </SignInButton>
                            </SignedOut>
                        </>
                    ) : (
                        <Link
                            href="/sign-in"
                            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2"
                        >
                            Sign In
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
}

