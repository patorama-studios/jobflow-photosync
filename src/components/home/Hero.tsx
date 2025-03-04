
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-[30%] -right-[25%] w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl"></div>
        <div className="absolute -bottom-[10%] -left-[10%] w-[400px] h-[400px] rounded-full bg-primary/5 blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left column: Text content */}
          <div className="max-w-xl mx-auto lg:mx-0 text-center lg:text-left">
            <h1 className="mb-4 font-semibold leading-tight tracking-tight text-foreground">
              Streamline Your <span className="text-primary">Real Estate Content</span> Workflow
            </h1>
            <p className="mb-8 text-lg md:text-xl text-muted-foreground">
              An all-in-one platform for real estate photography businesses. From booking to delivery, manage every aspect of your content creation process.
            </p>
            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
              <Button size="lg" asChild>
                <Link to="/dashboard" className="group">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button size="lg" variant="outline">
                Learn More
              </Button>
            </div>
          </div>
          
          {/* Right column: Feature image */}
          <div className="relative max-w-lg mx-auto lg:ml-auto animate-float">
            <div className="bg-gradient-to-br from-primary/80 to-primary rounded-2xl overflow-hidden shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1073&q=80"
                alt="Real estate photography management"
                className="w-full h-full object-cover mix-blend-overlay opacity-80"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="glass p-6 rounded-xl max-w-xs text-center">
                  <h3 className="text-xl font-medium mb-2">Content Management</h3>
                  <p className="text-sm text-foreground/80">
                    Streamline your workflow with our powerful platform
                  </p>
                </div>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -top-6 -right-6 w-20 h-20 bg-secondary rounded-full flex items-center justify-center animate-pulse">
              <div className="w-12 h-12 bg-accent rounded-full"></div>
            </div>
            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-primary/10 rounded-full"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
