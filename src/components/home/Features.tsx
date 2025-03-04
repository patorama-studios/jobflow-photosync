
import { Camera, Calendar, Users, FileImage, BookOpen, MessageSquare, DollarSign, BarChart } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";

const features = [
  {
    icon: <Calendar className="h-10 w-10 text-primary" />,
    title: "Job Management",
    description: "Intelligent scheduling system with calendar integration and drive time calculation."
  },
  {
    icon: <Users className="h-10 w-10 text-primary" />,
    title: "Client Management",
    description: "Complete client portal for managing content bookings, payments, and teams."
  },
  {
    icon: <FileImage className="h-10 w-10 text-primary" />,
    title: "Content Delivery",
    description: "Beautiful delivery website showcasing content with payment-based access control."
  },
  {
    icon: <BookOpen className="h-10 w-10 text-primary" />,
    title: "Learning Hub",
    description: "Comprehensive training resources for photographers and team members."
  },
  {
    icon: <MessageSquare className="h-10 w-10 text-primary" />,
    title: "Change Requests",
    description: "Custom UI for clients to annotate directly on photos, videos, and PDFs."
  },
  {
    icon: <Camera className="h-10 w-10 text-primary" />,
    title: "Team Management",
    description: "Manage contractor availability, scheduling, and workload balancing."
  },
  {
    icon: <DollarSign className="h-10 w-10 text-primary" />,
    title: "Payment & Invoicing",
    description: "Seamless integration with Stripe and Xero for hassle-free payments."
  },
  {
    icon: <BarChart className="h-10 w-10 text-primary" />,
    title: "Reporting & Analytics",
    description: "Comprehensive insights into business performance and client activity."
  }
];

export function Features() {
  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-semibold mb-4">Comprehensive Features</h2>
          <p className="text-lg text-muted-foreground">
            Everything you need to run your real estate content creation business efficiently in one platform.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <GlassCard 
              key={index} 
              className={`flex flex-col items-center text-center p-8 animate-slide-in-bottom`}
              hoverEffect
            >
              <div className="mb-6">{feature.icon}</div>
              <h3 className="text-xl font-medium mb-3">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}
