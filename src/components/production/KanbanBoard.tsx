
import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ChevronDown, 
  Clock, 
  Calendar, 
  User, 
  Camera, 
  Video, 
  Palette, 
  Layers 
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";

// Mock data for the kanban board
const MOCK_COLUMNS = [
  {
    id: "todo",
    title: "To Do",
    color: "bg-slate-200 text-slate-700",
    count: 5
  },
  {
    id: "inProgress",
    title: "In Progress",
    color: "bg-blue-100 text-blue-700",
    count: 3
  },
  {
    id: "review",
    title: "Review",
    color: "bg-amber-100 text-amber-700",
    count: 2
  },
  {
    id: "done",
    title: "Done",
    color: "bg-green-100 text-green-700",
    count: 4
  }
];

const MOCK_TASKS = {
  "todo": [
    {
      id: "task-1",
      title: "Real Estate Photography",
      client: "ABC Properties",
      dueDate: "2023-06-15",
      type: "Photography",
      priority: "High",
      assignee: "Jane Cooper",
      avatar: "",
      progress: 0
    },
    {
      id: "task-2",
      title: "Product Shoot - Summer Line",
      client: "Fashion Forward",
      dueDate: "2023-06-18",
      type: "Photography",
      priority: "Medium",
      assignee: "Alex Morgan",
      avatar: "",
      progress: 0
    },
    {
      id: "task-3",
      title: "Wedding Venue Video",
      client: "Johnson Wedding",
      dueDate: "2023-06-20",
      type: "Video",
      priority: "Medium",
      assignee: "Tom Williams",
      avatar: "",
      progress: 0
    }
  ],
  "inProgress": [
    {
      id: "task-4",
      title: "Corporate Headshots",
      client: "Tech Innovations Inc",
      dueDate: "2023-06-10",
      type: "Photography",
      priority: "High",
      assignee: "Sarah Lee",
      avatar: "",
      progress: 45
    },
    {
      id: "task-5",
      title: "Restaurant Menu Photos",
      client: "Gourmet Bistro",
      dueDate: "2023-06-12",
      type: "Photography",
      priority: "Low",
      assignee: "Jane Cooper",
      avatar: "",
      progress: 30
    }
  ],
  "review": [
    {
      id: "task-6",
      title: "Hotel Property Tour",
      client: "Luxury Stays",
      dueDate: "2023-06-05",
      type: "Video",
      priority: "High",
      assignee: "Mark Johnson",
      avatar: "",
      progress: 85
    },
    {
      id: "task-7",
      title: "Product Catalog Design",
      client: "HomeGoods Inc",
      dueDate: "2023-06-08",
      type: "Design",
      priority: "Medium",
      assignee: "Lisa Chen",
      avatar: "",
      progress: 90
    }
  ],
  "done": [
    {
      id: "task-8",
      title: "Family Portrait Session",
      client: "Smith Family",
      dueDate: "2023-05-30",
      type: "Photography",
      priority: "Medium",
      assignee: "David Kim",
      avatar: "",
      progress: 100
    },
    {
      id: "task-9",
      title: "Website Banner Images",
      client: "E-Shop Online",
      dueDate: "2023-06-01",
      type: "Design",
      priority: "Low",
      assignee: "Emma Wilson",
      avatar: "",
      progress: 100
    }
  ]
};

// Helper function to get icon based on task type
const getTaskTypeIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case "photography":
      return <Camera className="h-4 w-4" />;
    case "video":
      return <Video className="h-4 w-4" />;
    case "design":
      return <Palette className="h-4 w-4" />;
    default:
      return <Layers className="h-4 w-4" />;
  }
};

// Helper function to get color based on priority
const getPriorityColor = (priority: string) => {
  switch (priority.toLowerCase()) {
    case "high":
      return "bg-red-100 text-red-700";
    case "medium":
      return "bg-amber-100 text-amber-700";
    case "low":
      return "bg-green-100 text-green-700";
    default:
      return "bg-slate-100 text-slate-700";
  }
};

export function KanbanBoard() {
  const [columns] = useState(MOCK_COLUMNS);
  const [tasks] = useState(MOCK_TASKS);

  return (
    <div className="overflow-x-auto">
      <div className="flex space-x-4 min-w-[800px] pb-8 pt-2">
        {columns.map((column) => (
          <div key={column.id} className="flex-1 min-w-[250px]">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <h3 className="font-medium">{column.title}</h3>
                <Badge variant="outline" className="ml-2">
                  {column.count}
                </Badge>
              </div>
              <button className="text-muted-foreground hover:text-foreground">
                <ChevronDown className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-3">
              {tasks[column.id as keyof typeof tasks]?.map((task) => (
                <Card key={task.id} className="shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader className="p-3 pb-0">
                    <CardTitle className="text-sm font-medium">{task.title}</CardTitle>
                    <p className="text-xs text-muted-foreground">{task.client}</p>
                  </CardHeader>
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 text-muted-foreground mr-1" />
                        <span className="text-xs text-muted-foreground">
                          {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                      </div>
                      <Badge className={getPriorityColor(task.priority)} variant="secondary">
                        {task.priority}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge variant="outline" className="flex items-center gap-1 text-xs">
                        {getTaskTypeIcon(task.type)}
                        {task.type}
                      </Badge>
                    </div>
                    {task.progress > 0 && (
                      <div className="w-full mt-2">
                        <div className="flex justify-between text-xs mb-1">
                          <span>Progress</span>
                          <span>{task.progress}%</span>
                        </div>
                        <Progress value={task.progress} className="h-1" />
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="p-3 pt-0 flex justify-between items-center">
                    <div className="flex items-center">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={task.avatar} />
                        <AvatarFallback className="text-xs">
                          {task.assignee.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs ml-2">{task.assignee}</span>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
