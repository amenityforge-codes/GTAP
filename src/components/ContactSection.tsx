import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Mail, MapPin, Phone, Lock } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const ContactSection = () => {
  const { toast } = useToast();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    organization: "",
    message: ""
  });
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [loginData, setLoginData] = useState({
    email: "",
    password: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message Sent!",
      description: "Thank you for contacting GTAP. We'll get back to you soon.",
    });
    setFormData({ name: "", email: "", organization: "", message: "" });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate admin credentials
    const ADMIN_EMAIL = "globaltimespanel@gmail.com";
    const ADMIN_PASSWORD = "Amenity";
    
    if (loginData.email.toLowerCase().trim() === ADMIN_EMAIL.toLowerCase() && 
        loginData.password === ADMIN_PASSWORD) {
      login(); // Set authentication state
      toast({
        title: "Login Successful!",
        description: "Welcome back! You have been logged in.",
      });
      setLoginData({ email: "", password: "" });
      setIsLoginOpen(false);
    } else {
      toast({
        title: "Login Failed",
        description: "Invalid email or password. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <section id="contact" className="py-24 bg-background relative">
      {/* Vertical Designer Button - Only visible in Contact Section */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 z-40">
        <button
          onClick={() => setIsLoginOpen(true)}
          className="py-6 px-3 rounded-l-2xl gradient-gold text-primary shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          aria-label="Admin Login"
        >
        </button>
      </div>

      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Header */}
          <div className="text-center space-y-6 animate-fade-in">
            <div className="inline-block px-6 py-2 rounded-full border border-gold/30 bg-gold/10">
              <span className="text-gold text-sm font-semibold tracking-wide">GET IN TOUCH</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-serif font-bold">
              Connect with <span className="text-gradient-gold">GTAP</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Have questions about accreditation or want to join our global network? We'd love to hear from you.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Contact Info */}
            <div className="space-y-6">
              <Card className="p-6 shadow-premium border-border/50 bg-card/50 backdrop-blur space-y-4">
                <div className="w-12 h-12 rounded-full gradient-gold flex items-center justify-center">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Email Us</h3>
                  <p className="text-sm text-muted-foreground">globaltimespanel@gmail.com</p>
                </div>
              </Card>

              <Card className="p-6 shadow-premium border-border/50 bg-card/50 backdrop-blur space-y-4">
                <div className="w-12 h-12 rounded-full gradient-gold flex items-center justify-center">
                  <Phone className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Call Us</h3>
                  <p className="text-sm text-muted-foreground">8309159939</p>
                </div>
              </Card>

              <Card className="p-6 shadow-premium border-border/50 bg-card/50 backdrop-blur space-y-4">
                <div className="w-12 h-12 rounded-full gradient-gold flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Visit Us</h3>
                  <p className="text-sm text-muted-foreground">
                    Global Headquarters
                    <br />
                    International Academic Center
                  </p>
                </div>
              </Card>
            </div>

            {/* Contact Form */}
            <Card className="lg:col-span-2 p-8 shadow-premium border-border/50 bg-card/50 backdrop-blur">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">
                      Full Name
                    </label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      required
                      className="bg-background/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      Email Address
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@university.edu"
                      required
                      className="bg-background/50"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="organization" className="text-sm font-medium">
                    Organization / Institution
                  </label>
                  <Input
                    id="organization"
                    name="organization"
                    value={formData.organization}
                    onChange={handleChange}
                    placeholder="Your University or Organization"
                    required
                    className="bg-background/50"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium">
                    Message
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us about your interest in GTAP accreditation..."
                    rows={6}
                    required
                    className="bg-background/50 resize-none"
                  />
                </div>

                <Button 
                  type="submit"
                  size="lg"
                  className="w-full gradient-gold text-primary font-semibold hover:opacity-90 transition-opacity"
                >
                  Send Message
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </div>

      {/* Login Dialog */}
      <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-serif">Admin Login</DialogTitle>
            <DialogDescription>
              Enter your credentials to access the admin panel
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleLoginSubmit} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="login-email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="login-email"
                  name="email"
                  type="email"
                  value={loginData.email}
                  onChange={handleLoginChange}
                  placeholder="globaltimespanel@gmail.com"
                  required
                  className="pl-10 bg-background/50"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="login-password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="login-password"
                  name="password"
                  type="password"
                  value={loginData.password}
                  onChange={handleLoginChange}
                  placeholder="Enter your password"
                  required
                  className="pl-10 bg-background/50"
                />
              </div>
            </div>
            <Button 
              type="submit"
              className="w-full gradient-gold text-primary font-semibold hover:opacity-90 transition-opacity"
            >
              Sign In
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default ContactSection;
