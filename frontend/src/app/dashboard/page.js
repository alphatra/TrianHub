"use client"

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { LayoutDashboard, Dumbbell, Brain, Calendar } from "lucide-react";

export default function DashboardPage() {
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
                    <Button variant="secondary" className="w-full justify-start">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        Panel
                    </Button>
                    <Link href="/training" className="w-full">
                        <Button variant="ghost" className="w-full justify-start">
                            <Dumbbell className="mr-2 h-4 w-4" />
                            Trening
                        </Button>
                    </Link>
                    <Button variant="ghost" className="w-full justify-start">
                        <Brain className="mr-2 h-4 w-4" />
                        Asystent treningowy
                    </Button>
                    <Button variant="ghost" className="w-full justify-start">
                        <Calendar className="mr-2 h-4 w-4" />
                        Harmonogram
                    </Button>
                </nav>
            </Card>

            {/* Main content */}
            <div className="flex-1 p-2 grid grid-cols-3 grid-rows-3 gap-2">
                <Card className="col-span-2 row-span-2 p-4">
                    <h2 className="text-2xl font-bold mb-4">Welcome to your dashboard, {session.user.name}!</h2>
                    <p>Here you can see your recent activities and upcoming events.</p>
                </Card>
                <Card className="p-4">
                    <h3 className="font-semibold mb-2">Quick Stats</h3>
                    {/* Add some quick stats here */}
                </Card>
                <Card className="p-4">
                    <h3 className="font-semibold mb-2">Notifications</h3>
                    {/* Add notifications here */}
                </Card>
                <Card className="col-span-2 p-4">
                    <h3 className="font-semibold mb-2">Recent Trainings</h3>
                    {/* Add a list of recent trainings here */}
                </Card>
                <Card className="col-span-3 p-4">
                    <h3 className="font-semibold mb-2">Training Calendar</h3>
                    {/* Add a calendar component here */}
                </Card>
            </div>
        </div>
    );
}