import Link from "next/link";
import { Zap } from "lucide-react";

// This page doesn't use Clerk components to allow static generation
export default function NotFound() {
    return (
        <div className="flex min-h-[calc(100vh-56px)] flex-col items-center justify-center gap-4 text-center">
            <Zap className="h-16 w-16 text-purple-500" />
            <h1 className="text-4xl font-bold">404</h1>
            <h2 className="text-xl text-muted-foreground">Page Not Found</h2>
            <p className="max-w-md text-muted-foreground">
                The page you&apos;re looking for doesn&apos;t exist or has been moved.
            </p>
            <Link
                href="/"
                className="mt-4 inline-flex h-10 items-center justify-center rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 px-6 text-sm font-medium text-white shadow-lg transition-all hover:opacity-90"
            >
                Go Home
            </Link>
        </div>
    );
}
