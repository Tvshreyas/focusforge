import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import Link from "next/link";
import { Zap, Timer, TrendingUp, Shield, Chrome } from "lucide-react";

// Force dynamic rendering to avoid SSG issues with Clerk
export const dynamic = "force-dynamic";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="container flex flex-col items-center justify-center gap-4 py-16 md:py-24">
        <div className="flex items-center gap-2 rounded-full border bg-muted px-4 py-1.5 text-sm">
          <span className="text-muted-foreground">🎯 Build focus like a muscle</span>
        </div>

        <h1 className="max-w-4xl text-center text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
          Train Your Brain for{" "}
          <span className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 bg-clip-text text-transparent">
            Unbreakable Focus
          </span>
        </h1>

        <p className="max-w-2xl text-center text-lg text-muted-foreground">
          Start with 5 minutes. Unlock up to 120 minutes. FocusForge uses
          progressive training and browser blocking to help you build lasting
          focus habits.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <SignedOut>
            <SignInButton mode="modal">
              <button className="inline-flex h-12 items-center justify-center rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 px-8 text-base font-medium text-white shadow-lg transition-all hover:opacity-90 hover:shadow-xl">
                Start Training Free
              </button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <Link
              href="/dashboard"
              className="inline-flex h-12 items-center justify-center rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 px-8 text-base font-medium text-white shadow-lg transition-all hover:opacity-90 hover:shadow-xl"
            >
              Go to Dashboard
            </Link>
          </SignedIn>
          <Link
            href="#features"
            className="inline-flex h-12 items-center justify-center rounded-lg border border-border px-8 text-base font-medium transition-colors hover:bg-accent"
          >
            Learn More
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container py-16 md:py-24">
        <h2 className="mb-12 text-center text-3xl font-bold">
          How FocusForge Works
        </h2>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <FeatureCard
            icon={<Timer className="h-8 w-8 text-purple-500" />}
            title="Progressive Training"
            description="Start at 5 minutes. As you complete sessions, unlock longer durations up to 120 minutes."
          />
          <FeatureCard
            icon={<Shield className="h-8 w-8 text-pink-500" />}
            title="Browser Blocking"
            description="Our Chrome extension blocks distracting sites during focus sessions. No cheating allowed."
          />
          <FeatureCard
            icon={<TrendingUp className="h-8 w-8 text-orange-500" />}
            title="Streak Tracking"
            description="Build momentum with daily streaks. Track your progress and earn milestones."
          />
          <FeatureCard
            icon={<Chrome className="h-8 w-8 text-blue-500" />}
            title="Chrome Extension"
            description="Seamless integration with your browser. Set up once and focus forever."
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t bg-muted/50">
        <div className="container flex flex-col items-center gap-4 py-16 text-center">
          <Zap className="h-12 w-12 text-purple-500" />
          <h2 className="text-3xl font-bold">Ready to Level Up Your Focus?</h2>
          <p className="max-w-xl text-muted-foreground">
            Join thousands building better focus habits with FocusForge.
            Start your journey today — it&apos;s free to begin.
          </p>
          <SignedOut>
            <SignInButton mode="modal">
              <button className="mt-4 inline-flex h-12 items-center justify-center rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 px-8 text-base font-medium text-white shadow-lg transition-all hover:opacity-90 hover:shadow-xl">
                Get Started Free
              </button>
            </SignInButton>
          </SignedOut>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container flex flex-col items-center gap-4 text-center text-sm text-muted-foreground md:flex-row md:justify-between">
          <p>© 2026 FocusForge. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:underline">
              Privacy
            </Link>
            <Link href="/terms" className="hover:underline">
              Terms
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border bg-card p-6 text-center shadow-sm transition-shadow hover:shadow-md">
      {icon}
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
