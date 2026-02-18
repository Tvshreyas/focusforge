import { DashboardClient } from "./dashboard-client";

// Force dynamic rendering to avoid SSG issues with Clerk/Convex client hooks
export const dynamic = "force-dynamic";

export default function DashboardPage() {
    return <DashboardClient />;
}
