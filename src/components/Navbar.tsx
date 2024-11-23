import { Button } from "@/components/ui/button";
import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from "@/components/ui/navigation-menu";
import { Menu } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Mic2 } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    if (location.pathname !== '/') {
      navigate('/', { state: { scrollTo: sectionId } });
    } else {
      const element = document.getElementById(sectionId);
      element?.scrollIntoView({ behavior: 'smooth' });
    }
    setIsOpen(false);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  const navItems = [
    { label: "Podcasts", href: "/podcasts" },
    { label: "Features", onClick: () => scrollToSection('features') },
    { label: "Pricing", onClick: () => scrollToSection('pricing') },
  ];

  return (
    <header className="fixed top-0 w-full bg-black/95 border-b border-neutral-800 backdrop-blur-sm z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
          <Mic2 className="h-6 w-6 text-green-500" />
          <span className="text-xl font-bold">PodcastAI</span>
        </Link>

        {/* Desktop Navigation */}
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList className="space-x-6">
            {navItems.map((item) => (
              <NavigationMenuItem key={item.label}>
                {item.href ? (
                  <Link
                    to={item.href}
                    className="text-sm hover:text-green-500 transition-colors"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <button
                    onClick={item.onClick}
                    className="text-sm hover:text-green-500 transition-colors"
                  >
                    {item.label}
                  </button>
                )}
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          <Button 
            variant="ghost" 
            className="text-sm hover:text-green-500"
            onClick={() => handleNavigation('/login')}
          >
            Log in
          </Button>
          <Button 
            className="bg-green-500 hover:bg-green-600 text-black"
            onClick={() => handleNavigation('/signup')}
          >
            Sign up
          </Button>
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-black/95 border-neutral-800">
              <nav className="flex flex-col gap-4">
                {navItems.map((item) => (
                  <div key={item.label}>
                    {item.href ? (
                      <Link
                        to={item.href}
                        className="block py-2 text-lg hover:text-green-500 transition-colors"
                        onClick={() => setIsOpen(false)}
                      >
                        {item.label}
                      </Link>
                    ) : (
                      <button
                        onClick={item.onClick}
                        className="block w-full text-left py-2 text-lg hover:text-green-500 transition-colors"
                      >
                        {item.label}
                      </button>
                    )}
                  </div>
                ))}
                <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-neutral-800">
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-lg hover:text-green-500"
                    onClick={() => handleNavigation('/login')}
                  >
                    Log in
                  </Button>
                  <Button 
                    className="w-full justify-start text-lg bg-green-500 hover:bg-green-600 text-black"
                    onClick={() => handleNavigation('/signup')}
                  >
                    Sign up
                  </Button>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}