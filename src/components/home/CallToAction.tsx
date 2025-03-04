
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function CallToAction() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-primary rounded-3xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="p-8 md:p-12 lg:p-16 flex items-center">
              <div>
                <h2 className="text-white font-semibold mb-4">Ready to Transform Your Business?</h2>
                <p className="text-primary-foreground/80 text-lg mb-8 max-w-lg">
                  Join the growing community of real estate photography businesses streamlining their operations with our comprehensive platform.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" variant="secondary" asChild>
                    <Link to="/dashboard" className="group">
                      Get Started
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" className="border-white text-white hover:text-primary hover:bg-white">
                    Contact Sales
                  </Button>
                </div>
              </div>
            </div>
            <div className="relative hidden lg:block">
              <img 
                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1073&q=80" 
                alt="Real estate photography" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-primary/40"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
