import { useLocation, useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleNavigate = (id: string) => {
    if (location.pathname !== "/") {
      navigate("/", { state: { scrollTo: id } });
      return;
    }

    scrollToSection(id);
  };

  return (
    <footer className="py-12 border-t border-border/50 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <img 
                  src="/GTAP LOGO.jpg" 
                  alt="GTAP Logo" 
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span className="text-xl font-serif font-bold">GTAP</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Accrediting Excellence. Inspiring Innovation.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><button onClick={() => handleNavigate("about")} className="hover:text-gold transition-colors">About GTAP</button></li>
                <li><button onClick={() => handleNavigate("vision")} className="hover:text-gold transition-colors">Our Vision</button></li>
                <li><button onClick={() => handleNavigate("panel")} className="hover:text-gold transition-colors">The Panel</button></li>
                <li><button onClick={() => handleNavigate("impact")} className="hover:text-gold transition-colors">Global Impact</button></li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><button onClick={() => handleNavigate("resources-process")} className="hover:text-gold transition-colors">Accreditation Process</button></li>
                <li><button onClick={() => handleNavigate("resources-levels")} className="hover:text-gold transition-colors">Accreditation Levels</button></li>
                <li><button onClick={() => handleNavigate("resources-standards")} className="hover:text-gold transition-colors">Standards & Guidelines</button></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>globaltimespanel@gmail.com</li>
                <li>8309159939</li>
                <li className="pt-2">
                  <button 
                    onClick={() => handleNavigate("contact")}
                    className="text-gold hover:text-gold-light transition-colors"
                  >
                    Get in Touch →
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-border/50 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-muted-foreground">
              © 2024 GTAP - Global T.I.M.E.S Accreditation Panel. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-gold transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-gold transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
