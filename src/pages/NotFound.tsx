
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { FileQuestion } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <MainLayout>
      <div className="container py-12 flex items-center justify-center">
        <div className="bg-muted/50 rounded-lg p-8 max-w-md w-full text-center">
          <FileQuestion className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Page Not Found</h2>
          <p className="text-muted-foreground mb-6">
            We couldn't find the page: <span className="font-mono bg-muted px-1 rounded">{location.pathname}</span>
          </p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <Button asChild>
              <Link to="/dashboard">Go to Dashboard</Link>
            </Button>
            <Button variant="outline" onClick={() => window.history.back()}>
              Go Back
            </Button>
          </div>
          <div className="mt-6 text-sm text-muted-foreground">
            <p>Looking for something specific? Try one of these links:</p>
            <div className="mt-2 flex flex-wrap gap-2 justify-center">
              <Link to="/orders" className="text-blue-500 hover:underline">Orders</Link>
              <Link to="/calendar" className="text-blue-500 hover:underline">Calendar</Link>
              <Link to="/clients" className="text-blue-500 hover:underline">Clients</Link>
              <Link to="/settings" className="text-blue-500 hover:underline">Settings</Link>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default NotFound;
