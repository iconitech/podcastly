import { Button } from "@/components/ui/button";
import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from "@/components/ui/navigation-menu";
import { Mic2 } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const scrollToSection = (sectionId: string) => {
    if (location.pathname !== '/') {
      navigate('/', { state: { scrollTo: sectionId } });
    } else {
      const element = document.getElementById(sectionId);
      element?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="fixed top-0 w-full bg-black/95 border-b border-neutral-800 backdrop-blur-sm z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
          <Mic2 className="h-6 w-6 text-green-500" />
          <span className="text-xl font-bold">PodcastAI</span>
        </Link>

        <NavigationMenu>
          <NavigationMenuList className="hidden md:flex space-x-6">
            <NavigationMenuItem>
              <Link 
                to="/podcasts"
                className="text-sm hover:text-green-500 transition-colors"
              >
                Podcasts
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <button
                onClick={() => scrollToSection('features')}
                className="text-sm hover:text-green-500 transition-colors"
              >
                Features
              </button>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <button
                onClick={() => scrollToSection('pricing')}
                className="text-sm hover:text-green-500 transition-colors"
              >
                Pricing
              </button>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            className="text-sm hover:text-green-500"
            onClick={() => navigate('/login')}
          >
            Log in
          </Button>
          <Button 
            className="bg-green-500 hover:bg-green-600 text-black"
            onClick={() => navigate('/signup')}
          >
            Sign up
          </Button>
        </div>
      </div>
    </header>
  );
}