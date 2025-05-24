import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart, CheckCircle, Clock, FileText, Users } from "lucide-react";
import Image from "next/image";

export default function DashboardPage() {
  const stats = [
    { title: "Total Test Cases", value: "1,250", icon: FileText, color: "text-primary" },
    { title: "Active Test Plans", value: "25", icon: ClipboardList, color: "text-accent" },
    { title: "Tests Executed Today", value: "340", icon: CheckCircle, color: "text-green-500" },
    { title: "Pending Reviews", value: "12", icon: Clock, color: "text-yellow-500" },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{stat.value}</div>
              {/* <p className="text-xs text-muted-foreground">+20.1% from last month</p> */}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-foreground">Recent Activity</CardTitle>
            <CardDescription className="text-muted-foreground">Overview of recent test executions and changes.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {[
                { user: "Alice", action: "executed Test Plan 'Alpha Release'", time: "10m ago" },
                { user: "Bob", action: "updated Test Case TC-087", time: "45m ago" },
                { user: "Charlie", action: "created Test Plan 'Beta Feature Test'", time: "2h ago" },
                { user: "David", action: "marked 3 tests as Passed", time: "3h ago" },
              ].map((activity, index) => (
                <li key={index} className="flex items-center space-x-3 p-2 rounded-md hover:bg-muted/50 transition-colors">
                  <Users className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      <span className="font-semibold">{activity.user}</span> {activity.action}.
                    </p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-foreground">Execution Overview</CardTitle>
            <CardDescription className="text-muted-foreground">Placeholder for test execution statistics chart.</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center h-[200px] bg-muted/30 rounded-md">
            {/* Placeholder for a chart component */}
            <div className="text-center text-muted-foreground">
              <BarChart className="h-16 w-16 mx-auto mb-2" />
              <p>Chart data will be displayed here.</p>
              <Image 
                src="https://placehold.co/600x300.png" 
                alt="Placeholder chart" 
                width={600} 
                height={300} 
                className="mt-4 rounded-md object-cover"
                data-ai-hint="bar chart"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Dummy ClipboardList icon if not imported from lucide-react
const ClipboardList = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="8" height="4" x="8" y="2" rx="1" ry="1"></rect>
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
    <path d="M12 11h4"></path>
    <path d="M12 16h4"></path>
    <path d="M8 11h.01"></path>
    <path d="M8 16h.01"></path>
  </svg>
);
