
import { TrendingUp, Users, Calendar, FileImage } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const stats = [
  {
    title: "Total Jobs",
    value: "128",
    change: "+12%",
    icon: <Calendar className="h-5 w-5 text-primary" />,
    trend: "up"
  },
  {
    title: "Active Clients",
    value: "64",
    change: "+8%",
    icon: <Users className="h-5 w-5 text-primary" />,
    trend: "up"
  },
  {
    title: "Content Delivered",
    value: "2,456",
    change: "+24%",
    icon: <FileImage className="h-5 w-5 text-primary" />,
    trend: "up"
  },
  {
    title: "Revenue",
    value: "$48,760",
    change: "+15%",
    icon: <TrendingUp className="h-5 w-5 text-primary" />,
    trend: "up"
  }
];

export function StatsCards() {
  return (
    <>
      {stats.map((stat, index) => (
        <Card key={index} className="overflow-hidden">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                <h3 className="text-2xl font-semibold mt-2">{stat.value}</h3>
                <div className="flex items-center mt-1">
                  <span className={`text-xs font-medium ${
                    stat.trend === 'up' ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {stat.change}
                  </span>
                  <span className="text-xs text-muted-foreground ml-1">from last month</span>
                </div>
              </div>
              <div className="bg-primary/10 p-3 rounded-lg">{stat.icon}</div>
            </div>
          </CardContent>
        </Card>
      ))}
    </>
  );
}
