"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Dumbbell, Brain, Calendar, Loader2 } from "lucide-react";

export default function DashboardLayout({children}) {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        }
    }, [status, router]);

    if (status === "loading") {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader2 className="mr-2 h-16 w-16 animate-spin" />
            </div>
        );
    }

    if (!session) {
        return null;
    }

    return (
        <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
            {/* Sidebar */}
            <Card className="w-64 p-4 m-2 space-y-4">
                <div className="flex items-center space-x-4">
                    <Avatar>
                        <AvatarImage src={session.user.image || ""} alt={session.user.name || "User"} />
                        <AvatarFallback>{session.user.name?.slice(0, 2).toUpperCase() || "U"}</AvatarFallback>
                    </Avatar>
                    <div>
                        <h2 className="font-semibold">{session.user.name}</h2>
                        <p className="text-sm text-gray-500">{session.user.email}</p>
                    </div>
                </div>
                <nav className="space-y-2">
                    <Link href="/dashboard">
                        <Button variant="secondary" className="w-full justify-start">
                            <LayoutDashboard className="mr-2 h-4 w-4" />
                            Panel
                        </Button>
                    </Link>
                    <Link href="/dashboard/training">
                        <Button variant="ghost" className="w-full justify-start">
                            <Dumbbell className="mr-2 h-4 w-4" />
                            Trening
                        </Button>
                    </Link>
                    <Link href="/dashboard/asystent">
                    <Button variant="ghost" className="w-full justify-start">
                        <Brain className="mr-2 h-4 w-4" />
                        Asystent treningowy
                    </Button>
                    </Link>
                    <Link href="/dashboard/calendar">
                    <Button variant="ghost" className="w-full justify-start">
                        <Calendar className="mr-2 h-4 w-4" />
                        Harmonogram
                    </Button>
                    </Link>
                </nav>
            </Card>

            {/* Main content */}
            <div className="flex-1 p-6 overflow-auto">
                {React.cloneElement(children, { session: session })}
            </div>
        </div>
    );
}