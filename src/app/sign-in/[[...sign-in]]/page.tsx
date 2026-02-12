import { SignIn } from "@clerk/nextjs";

export const dynamic = "force-dynamic";

export default function SignInPage() {
    return (
        <div className="flex min-h-[calc(100vh-56px)] items-center justify-center">
            <SignIn
                appearance={{
                    elements: {
                        rootBox: "mx-auto",
                        card: "bg-background border border-border shadow-lg",
                    },
                }}
                redirectUrl="/dashboard"
            />
        </div>
    );
}
