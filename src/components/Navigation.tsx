import { Button } from "@/components/ui/button";
import { Menu, LogOut } from "lucide-react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, logout } = useAuth();
  const { toast } = useToast();

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    setIsOpen(false);
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsOpen(false);
    }
  };

  const handleSectionClick = (id: string) => {
    if (location.pathname !== "/") {
      navigate("/", { state: { scrollTo: id } });
      setIsOpen(false);
      return;
    }

    scrollToSection(id);
  };

  const handleNavigate = (path: string) => {
    if (location.pathname !== path) {
      navigate(path);
    }
    setIsOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <button 
            onClick={() => handleNavigate("/")}
            className="flex items-center space-x-2 hover:opacity-80 transition-opacity cursor-pointer"
          >
            <div className="w-10 h-10 rounded-full gradient-gold flex items-center justify-center">
              <span className="text-primary font-bold text-xl">G</span>
            </div>
            <span className="text-2xl font-serif font-bold">GTAP</span>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => handleNavigate("/rankings")}
              className={`text-sm font-medium transition-colors ${location.pathname === "/rankings" ? "text-secondary" : "hover:text-secondary"}`}
            >
              Rankings
            </button>
            <button onClick={() => handleSectionClick('about')} className="text-sm font-medium hover:text-secondary transition-colors">
              About
            </button>
            <button onClick={() => handleSectionClick('vision')} className="text-sm font-medium hover:text-secondary transition-colors">
              Vision
            </button>
            <button onClick={() => handleSectionClick('panel')} className="text-sm font-medium hover:text-secondary transition-colors">
              The Panel
            </button>
            <button onClick={() => handleSectionClick('impact')} className="text-sm font-medium hover:text-secondary transition-colors">
              Impact
            </button>
            <button
              onClick={() => handleNavigate("/certificates")}
              className={`text-sm font-medium transition-colors ${location.pathname === "/certificates" ? "text-secondary" : "hover:text-secondary"}`}
            >
              Certificates
            </button>
            <button
              onClick={() => handleNavigate("/international-curriculum")}
              className={`text-sm font-medium transition-colors ${location.pathname === "/international-curriculum" ? "text-secondary" : "hover:text-secondary"}`}
            >
              International Curriculum
            </button>
            <Button onClick={() => handleSectionClick('contact')} className="gradient-gold text-primary hover:opacity-90 transition-opacity">
              Contact Us
            </Button>
            {isAuthenticated && (
              <Button 
                onClick={handleLogout}
                variant="outline"
                className="gap-2 border-red-500/50 text-red-600 hover:bg-red-50 hover:border-red-500"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2"
            onClick={() => setIsOpen(!isOpen)}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 space-y-4">
            <button
              onClick={() => handleNavigate("/rankings")}
              className="block w-full text-left py-2 text-sm font-medium hover:text-secondary transition-colors"
            >
              Rankings
            </button>
            <button onClick={() => handleSectionClick('about')} className="block w-full text-left py-2 text-sm font-medium hover:text-secondary transition-colors">
              About
            </button>
            <button onClick={() => handleSectionClick('vision')} className="block w-full text-left py-2 text-sm font-medium hover:text-secondary transition-colors">
              Vision
            </button>
            <button onClick={() => handleSectionClick('panel')} className="block w-full text-left py-2 text-sm font-medium hover:text-secondary transition-colors">
              The Panel
            </button>
            <button onClick={() => handleSectionClick('impact')} className="block w-full text-left py-2 text-sm font-medium hover:text-secondary transition-colors">
              Impact
            </button>
            <button
              onClick={() => handleNavigate("/certificates")}
              className="block w-full text-left py-2 text-sm font-medium hover:text-secondary transition-colors"
            >
              Certificates
            </button>
            <button
              onClick={() => handleNavigate("/international-curriculum")}
              className="block w-full text-left py-2 text-sm font-medium hover:text-secondary transition-colors"
            >
              International Curriculum
            </button>
            <Button onClick={() => handleSectionClick('contact')} className="w-full gradient-gold text-primary hover:opacity-90 transition-opacity">
              Contact Us
            </Button>
            {isAuthenticated && (
              <Button 
                onClick={handleLogout}
                variant="outline"
                className="w-full gap-2 border-red-500/50 text-red-600 hover:bg-red-50 hover:border-red-500"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
