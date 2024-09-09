import DashboardLayout from "./layout";
import { Card } from "@/components/ui/card";


export default function DashboardPage() {
    
    
    return (
            <Card className="p-6">
            {/* Main content */}
            <div className="flex-1 p-2 grid grid-cols-3 grid-rows-3 gap-2">
                <Card className="col-span-2 row-span-2 p-4">
                    <h2 className="text-2xl font-bold mb-4">Welcome to your dashboard, {"Guest"}!</h2>
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
            
            </Card>
    );
}
