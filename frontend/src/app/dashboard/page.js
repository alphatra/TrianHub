"use client"

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        }
    }, [status, router]);

    if (status === "loading") {
        return <p>Loading...</p>;
    }

    if (!session) {
        return null;
    }

    return (
        <div>
            <h1>Welcome tso your dashboard, {session.user.name}!</h1>
            <p>Your email is: {session.user.email}</p>
        </div>
    );
}