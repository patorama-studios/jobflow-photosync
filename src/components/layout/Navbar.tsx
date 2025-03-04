
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  // Track scroll position for navbar styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const isActive = (path: string) => location.pathname === path;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white/80 backdrop-blur-md shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center space-x-2 text-xl font-semibold"
          >
            <span className="bg-primary text-white px-2 py-1 rounded">PS</span>
            <span>Patorama Studios</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className={`nav-link ${isActive("/") ? "active" : ""}`}>
              Home
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="nav-link flex items-center">
                  Features <ChevronDown className="ml-1 h-4 w-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem asChild>
                  <Link to="/dashboard" className="w-full">Job Management</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/client" className="w-full">Client Portal</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/learning" className="w-full">Learning Hub</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Link to="/dashboard" className={`nav-link ${isActive("/dashboard") ? "active" : ""}`}>
              Dashboard
            </Link>
            <Button asChild>
              <Link to="/login">Login</Link>
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-500 hover:text-gray-700 focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="container mx-auto px-4 py-4 space-y-3">
            <Link
              to="/"
              className="block py-2 text-base font-medium hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/dashboard"
              className="block py-2 text-base font-medium hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Job Management
            </Link>
            <Link
              to="/client"
              className="block py-2 text-base font-medium hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Client Portal
            </Link>
            <Link
              to="/learning"
              className="block py-2 text-base font-medium hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Learning Hub
            </Link>
            <Button className="w-full" asChild>
              <Link to="/login">Login</Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
