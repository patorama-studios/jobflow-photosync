
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="bg-secondary py-12 mt-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="flex items-center space-x-2 text-xl font-semibold mb-4">
              <span className="bg-primary text-white px-2 py-1 rounded">PS</span>
              <span>Patorama Studios</span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs">
              Streamlining your real estate content creation business with comprehensive job management and content delivery.
            </p>
          </div>
          
          <div>
            <h3 className="text-base font-medium mb-4">Features</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/dashboard" className="text-muted-foreground hover:text-primary transition-colors">
                  Job Management
                </Link>
              </li>
              <li>
                <Link to="/client" className="text-muted-foreground hover:text-primary transition-colors">
                  Client Portal
                </Link>
              </li>
              <li>
                <Link to="/learning" className="text-muted-foreground hover:text-primary transition-colors">
                  Learning Hub
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-base font-medium mb-4">Resources</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Support
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  FAQ
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-base font-medium mb-4">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="text-muted-foreground">
                support@patoramastudios.com
              </li>
              <li className="text-muted-foreground">
                1234 Studio Drive, Suite 100
              </li>
              <li className="text-muted-foreground">
                Melbourne, Australia
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border mt-10 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Patorama Studios. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
